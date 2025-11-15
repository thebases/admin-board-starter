// utils/logger.ts
const welcomeToBase = ()=>{
    console.info("======================================");
    console.info("* WELCOME TO BASE'S MERCHANT PORTAL *");
    console.info("======================================");
    console.info("        built by the Base");
}
const disableLogs = (): void => {
    welcomeToBase()
    console.info("=========PRODUCTION VERSION===========");
    console.log = () => {}; // Disable console.log
    console.info = () => {}; // Disable console.info
    console.warn = () => {}; // Disable console.warn
    console.error = () => {}; // Disable console.error
};

const enableDebug = (): void => {
    disableLogs(); // Disable other logs
    console.debug = (...args: any[]): void => {
        (console as any).originalDebug(...args); // Use original console.debug
    };
};

// Store original console.debug
if (!(console as any).originalDebug) {
    (console as any).originalDebug = console.debug;
}

export { enableDebug, disableLogs, welcomeToBase };
