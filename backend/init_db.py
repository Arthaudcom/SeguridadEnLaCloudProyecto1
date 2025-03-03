from app.database import Base, engine

# Créer toutes les tables dans la base de données
print("Création des tables en base de données...")
Base.metadata.create_all(engine)
print("Base de données initialisée avec succès !")
