// Format de réponse en cas de succès
exports.success = (result) => {
    return {
        status: 'success',
        result: result
    }
}

// Format de réponse en cas d'erreur
exports.error = (message) => {
    return {
        status: 'error',
        message: message
    }
}

// Vérifie si l'objet envoyé est une erreur
exports.isErr = (err) => {
    return err instanceof Error;
}

// Envoie le bon format de réponse selon l'objet à envoyer
exports.checkAndChange = (obj) => {
    if (this.isErr(obj)) {
        return this.error(obj.message)
    } else {
        return this.success(obj)
    }
}