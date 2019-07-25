export declare enum TimeType {
    device = "device",
    ntp = "ntp",
    ntpForce = "ntpForce",
}
declare const time: (type: TimeType) => Promise<Date>;
export default time;
