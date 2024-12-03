/**
 * Log les événements dans la console avec horodatage, préfixes et styles.
 * @param {string} type - Type de log : 'info', 'warn', 'error'.
 * @param {string} message - Message descriptif de l'événement.
 * @param {Object} [data={}] - Données supplémentaires à afficher (facultatif).
 */
export function LogEvent(type, message, data = {}) {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[FishEye][${timestamp}]`;

    const logStyles = {
        info: 'color: green;',
        warn: 'color: orange;',
        error: 'color: red;',
        default: 'color: black;'
    };

    const style = logStyles[type] || logStyles.default;

    if (!message) {
        console.warn('%c[AVERTISSEMENT] Message manquant dans logEvent', style);
        return;
    }

    const fullMessage = `${prefix} ${type.toUpperCase()}: ${message}`;

    switch (type.toLowerCase()) {
        case 'info':
            console.log(`%c${fullMessage}`, style, data);
            break;
        case 'warn':
            console.warn(`%c${fullMessage}`, style, data);
            break;
        case 'error':
            console.error(`%c${fullMessage}`, style, data);
            break;
        default:
            console.log(`%c${prefix} [INCONNU]: ${message}`, style, data);
    }
}
