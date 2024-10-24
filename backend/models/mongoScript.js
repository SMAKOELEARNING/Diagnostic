const { MongoClient } = require('mongodb');

async function connectToMongo() {
    const url = 'mongodb://localhost:27017';
    const dbName = 'smako_group';

    let client;

    try {
        client = new MongoClient(url, { useUnifiedTopology: true });
        await client.connect();
        console.log("Connexion réussie à la base de données smako_group");
        const db = client.db(dbName);
        return db;
    } catch (err) {
        console.error(`Erreur lors de la connexion à la base de données: ${err}`);
        return null;
    }
}

// Fonction pour supprimer toute la collection KPIdata
async function deleteKpiDataCollection(db) {
    try {
        await db.collection('KPIdata').drop();
        console.log("Collection KPIdata supprimée avec succès.");
    } catch (err) {
        if (err.code === 26) {
            console.log("La collection KPIdata n'existe pas encore.");
        } else {
            console.error(`Erreur lors de la suppression de la collection KPIdata: ${err}`);
        }
    }
}

async function getResponseDataNumbers(db) {
    try {
        const collection = db.collection('responsedatanumbers');
        const data = await collection.find().toArray();
        return data;
    } catch (err) {
        console.error(`Erreur lors de la récupération des données: ${err}`);
        return [];
    }
}

async function getAmazonCollection(db) {
    try {
        const collection = db.collection('Amazon');
        const data = await collection.find().toArray();
        return data;
    } catch (err) {
        console.error(`Erreur lors de la récupération des données de la collection Amazon: ${err}`);
        return [];
    }
}

async function createKpiDataCollection(db) {
    try {
        const responseDataNumbers = await getResponseDataNumbers(db);
        const amazonData = await getAmazonCollection(db);
        const kpiDataCollection = db.collection('KPIdata');

        for (const response of responseDataNumbers) {
            const questionText = response.questionText;
            const score = response.score;

            for (const amazonItem of amazonData) {
                if (amazonItem.question === questionText) {
                    if (amazonItem['Piliers RSE'] !== "NaN") {
                        await kpiDataCollection.insertOne({
                            categorie: 'Piliers RSE',
                            spécificité: amazonItem['Piliers RSE'],
                            score: score
                        });
                    }
                    if (amazonItem['ESG'] !== "NaN") {
                        await kpiDataCollection.insertOne({
                            categorie: 'ESG',
                            spécificité: amazonItem['ESG'],
                            score: score
                        });
                    }
                    if (amazonItem['5P'] !== "NaN") {
                        await kpiDataCollection.insertOne({
                            categorie: '5P',
                            spécificité: amazonItem['5P'],
                            score: score
                        });
                    }
                    if (amazonItem['Sphère ISQVT'] !== "NaN") {
                        await kpiDataCollection.insertOne({
                            categorie: 'Sphère ISQVT',
                            spécificité: amazonItem['Sphère ISQVT'],
                            score: score
                        });
                    }
                    if (amazonItem['Categorie'] !== "NaN") {
                        await kpiDataCollection.insertOne({
                            categorie: 'Categorie',
                            spécificité: amazonItem['Categorie'],
                            score: score
                        });
                    }
                    if (amazonItem['odd'] !== "NaN") {
                        await kpiDataCollection.insertOne({
                            categorie: 'odd',
                            spécificité: amazonItem['odd'],
                            score: score
                        });
                    }
                }
            }
        }

        console.log("KPIdata collection created successfully.");
    } catch (err) {
        console.error(`Erreur lors de la création de la collection KPIdata: ${err}`);
    }
}

async function deleteEmptyKpiData(db) {
    try {
        const kpiDataCollection = db.collection('KPIdata');
        const result = await kpiDataCollection.deleteMany({
            $or: [
                { spécificité: '' },
                { spécificité: { $type: 'double', $eq: NaN } }
            ]
        });
        console.log(`${result.deletedCount} documents supprimés de la collection KPIdata.`);
    } catch (err) {
        console.error(`Erreur lors de la suppression des documents de la collection KPIdata: ${err}`);
    }
}

// Script principal avec répétition toutes les 3 minutes
(async function executeScript() {
    console.log("Démarrage du script MongoDB...");

    const db = await connectToMongo();
    if (db) {
        await deleteKpiDataCollection(db); // Supprime toute la collection KPIdata
        await createKpiDataCollection(db); // Crée les nouveaux documents KPI
        await deleteEmptyKpiData(db);      // Supprime les documents avec spécificité vide ou NaN
    }

    // Répéter toutes les 3 minutes (180 000 ms)
    setInterval(async () => {
        console.log("Relancement du script MongoDB après 3 minutes...");
        const db = await connectToMongo();
        if (db) {
            await deleteKpiDataCollection(db);
            await createKpiDataCollection(db);
            await deleteEmptyKpiData(db);
        }
    }, 60000); // 180 000 millisecondes = 3 minutes
})();
