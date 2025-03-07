// Simulación de base de datos en memoria
const memoryVersionHistory = [
    {
        id: "change_001",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 días atrás
        author: "admin@cnmh.gov.co",
        changes: {
            locationId: "loc1",
            fieldChanged: "description",
            previousValue: "Descripción original del lugar de memoria.",
            newValue: "Este es un lugar de memoria ubicado en la región andina, departamento de antioquia. Este lugar ha sido identificado como un espacio significativo para la memoria colectiva."
        },
        comment: "Actualización de la descripción con información más precisa."
    },
    {
        id: "change_002",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 días atrás
        author: "editor@cnmh.gov.co",
        changes: {
            locationId: "loc15",
            fieldChanged: "title",
            previousValue: "Lugar de Memoria",
            newValue: "Lugar de Memoria 15 - Jardín de la Memoria"
        },
        comment: "Nombre actualizado según petición de la comunidad local."
    },
    {
        id: "change_003",
        timestamp: Date.now() - 1000 * 60 * 60 * 12, // 12 horas atrás
        author: "moderador@cnmh.gov.co",
        changes: {
            locationId: "loc34",
            fieldChanged: "type",
            previousValue: "solicitud",
            newValue: "caracterizados"
        },
        comment: "Actualización de estado: el lugar ha completado su proceso de caracterización."
    }
];
// Simulación de usuarios suscritos
const subscriptions = [
    {
        userId: "user1",
        userName: "Juan Pérez",
        email: "juan@example.com",
        locationIds: ["loc1", "loc2", "loc3"],
        regionIds: ["andina"],
        departmentIds: [],
        notificationPreference: "weekly",
        lastNotified: Date.now() - 1000 * 60 * 60 * 24 * 6 // 6 días atrás
    },
    {
        userId: "user2",
        userName: "María Gómez",
        email: "maria@example.com",
        locationIds: [],
        regionIds: ["caribe"],
        departmentIds: ["bolivar", "sucre"],
        notificationPreference: "immediate",
        lastNotified: Date.now() - 1000 * 60 * 60 * 24 * 2 // 2 días atrás
    },
    {
        userId: "user3",
        userName: "Comunidad de Paz",
        email: "comunidad@example.org",
        locationIds: ["loc15", "loc34"],
        regionIds: [],
        departmentIds: ["antioquia"],
        notificationPreference: "daily",
        lastNotified: Date.now() - 1000 * 60 * 60 * 23 // 23 horas atrás
    }
];
// Pendientes de notificación - simulación
const pendingNotifications = [
    {
        userId: "user3",
        changes: [memoryVersionHistory[2]] // El cambio más reciente
    }
];
// Funciones de API simuladas
export function getMemoryHistory(locationId) {
    if (locationId) {
        return memoryVersionHistory.filter(entry => entry.changes.locationId === locationId);
    }
    return memoryVersionHistory;
}
export function getRecentChanges(days = 7) {
    const cutoffTime = Date.now() - 1000 * 60 * 60 * 24 * days;
    return memoryVersionHistory.filter(entry => entry.timestamp >= cutoffTime);
}
export function getUserSubscriptions(userId) {
    return subscriptions.find(sub => sub.userId === userId) || null;
}
export function getAllSubscriptions() {
    return subscriptions;
}
export function addSubscription(subscription) {
    const newSubscription = {
        ...subscription,
        lastNotified: Date.now()
    };
    subscriptions.push(newSubscription);
    return newSubscription;
}
export function updateSubscription(subscription) {
    const index = subscriptions.findIndex(sub => sub.userId === subscription.userId);
    if (index >= 0) {
        subscriptions[index] = subscription;
        return subscription;
    }
    throw new Error("Subscription not found");
}
export function recordChange(locationId, fieldChanged, previousValue, newValue, author, comment) {
    const newEntry = {
        id: `change_${Date.now().toString(36)}`,
        timestamp: Date.now(),
        author,
        changes: {
            locationId,
            fieldChanged,
            previousValue,
            newValue
        },
        comment
    };
    memoryVersionHistory.unshift(newEntry); // Añadir al inicio para orden cronológico inverso
    checkAndCreateNotifications(newEntry);
    return newEntry;
}
// Función para simular la creación de notificaciones
function checkAndCreateNotifications(change) {
    const locationId = change.changes.locationId;
    // Buscar todas las suscripciones que apliquen a este cambio
    const affectedSubscriptions = subscriptions.filter(sub => {
        // Comprobar si el usuario está suscrito directamente a esta ubicación
        if (sub.locationIds.includes(locationId)) {
            return true;
        }
        // Si no, comprobar si está suscrito a la región o departamento
        const location = getLocationById(locationId);
        if (location) {
            return sub.regionIds.includes(location.region) ||
                sub.departmentIds.includes(location.department);
        }
        return false;
    });
    // Crear notificaciones pendientes para los usuarios afectados
    affectedSubscriptions.forEach(sub => {
        const existingNotification = pendingNotifications.find(n => n.userId === sub.userId);
        if (existingNotification) {
            existingNotification.changes.push(change);
        }
        else {
            pendingNotifications.push({
                userId: sub.userId,
                changes: [change]
            });
        }
        // Para notificaciones inmediatas, "enviar" la notificación
        if (sub.notificationPreference === 'immediate') {
            sendNotification(sub.userId, [change]);
        }
    });
}
// Simular el envío de una notificación
function sendNotification(userId, changes) {
    console.log(`[SIMULACIÓN] Enviando notificación a usuario ${userId} con ${changes.length} cambios`);
    // Actualizar el tiempo de última notificación
    const subIndex = subscriptions.findIndex(sub => sub.userId === userId);
    if (subIndex >= 0) {
        subscriptions[subIndex].lastNotified = Date.now();
    }
    // Eliminar de pendientes
    const notifIndex = pendingNotifications.findIndex(n => n.userId === userId);
    if (notifIndex >= 0) {
        pendingNotifications.splice(notifIndex, 1);
    }
}
// Función auxiliar para obtener un lugar por ID (simulada)
function getLocationById(id) {
    // En una implementación real, esto buscaría en la base de datos
    // Aquí simulamos un resultado
    if (id === "loc1") {
        return {
            id: "loc1",
            latitude: 6.2,
            longitude: -75.5,
            title: "Lugar de Memoria 1",
            type: "identificados",
            region: "andina",
            department: "antioquia",
            description: "Este es un lugar de memoria ubicado en la región andina, departamento de antioquia."
        };
    }
    return undefined;
}
// Obtener pendientes para interfaz de usuario
export function getPendingNotificationsCount() {
    return pendingNotifications.length;
}
