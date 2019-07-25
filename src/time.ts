// @ts-ignore
import ntpClient from 'react-native-ntp-client';

export enum TimeType {
    device = "device",
    ntp = "ntp",
    ntpForce = "ntpForce"
}

const time = (type: TimeType): Promise<Date> => new Promise((resolve, reject) => {
    if (type === TimeType.device) {
        return resolve(new Date());
    }

    ntpClient.getNetworkTime('pool.ntp.org', 123, (err: string|null, date: Date) => {
        if (err) {
            if (type === TimeType.ntpForce) {
                return reject(err);
            }

            return resolve(new Date());
        }

        return resolve(date);
    })
});

export default time;
