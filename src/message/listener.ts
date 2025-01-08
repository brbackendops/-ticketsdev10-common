import nat, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { Subject } from './subjects';
import { Event } from './utils';

const stan = nat.connect(
    'tickets',
    randomBytes(4).toString('hex'),
    {
        url:'http://localhost:4222'
    }
)

stan.on('connect', () => {
    console.log('Listener connected')
    stan.on('close', () => {
        console.log("NATS connection closed")
        process.exit();
    });
});
 

export abstract class Listener<T extends Event> {

    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;

    private client: nat.Stan;
    protected ackWait = 5 * 1000;

    constructor(client: nat.Stan){
        this.client = client;
    }

    subscriptionOptions(){
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName)
    }

    listen(){

        const subscription = this.client
            .subscribe(
                this.subject,
                this.queueGroupName,
                this.subscriptionOptions()
            );
        
        subscription.on('message', (msg: Message) => {
            const data = this.parseMessage(msg)
            this.onMessage(data,msg)
        });

    }

    parseMessage(msg: Message){
        const data = msg.getData()

        if (typeof data === 'string') {
            return JSON.parse(data)
        }

        return JSON.parse(data.toString('utf-8'))
    }
}


process.on('SIGINT', () => {
    stan.close()
});

process.on('SIGTERM', () => {
    stan.close()
});