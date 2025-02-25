import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Blog() {
  return (
    <div className="p-6 space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">Bienvenue sur notre blog</h1>
        <p className="text-gray-600 mt-2">
          Explorez nos articles, partagez vos idées, et connectez-vous avec d'autres passionnés.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* articulo */}
        <Card>
          <CardHeader>
            <CardTitle>Découverte de FastAPI</CardTitle>
            <CardDescription>Apprenez à utiliser FastAPI pour créer des API performantes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">FastAPI est un framework Python moderne, rapide et intuitif...</p>
            <Button variant="default" className="mt-4">Lire la suite</Button>
          </CardContent>
        </Card>

        {/* otros articulos */}
        <Card>
          <CardHeader>
            <CardTitle>Introduction à React</CardTitle>
            <CardDescription>Comprendre les bases de React et des composants.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">React est une bibliothèque JavaScript puissante pour créer des interfaces...</p>
            <Button variant="default" className="mt-4">Lire la suite</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Les bases de Docker</CardTitle>
            <CardDescription>Maîtrisez Docker pour déployer vos applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">Docker facilite la conteneurisation et le déploiement de vos projets...</p>
            <Button variant="default" className="mt-4">Lire la suite</Button>
          </CardContent>
        </Card>
      </section>

      <footer className="text-center mt-8">
        <p className="text-gray-500">© 2025 Mon Blog. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
