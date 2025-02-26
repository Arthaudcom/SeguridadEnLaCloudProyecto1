import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser, recoverPassword } from "../services/userService"; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Connexion
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      login(data.access_token);
    } catch (err) {
      setError("Correo o contraseña incorrectos.");
      console.error("Error al iniciar sesión:", err);
    } finally {
      setLoading(false);
    }
  };

  // Enregistrement d'un nouvel utilisateur
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      await registerUser({ username, email, password });
      setSuccessMessage("Registro exitoso. Ahora puedes iniciar sesión.");
      setIsRegistering(false);
    } catch (err) {
      setError("Error al registrarse. Verifique los datos.");
      console.error("Error en el registro:", err);
    } finally {
      setLoading(false);
    }
  };

  // Récupération du mot de passe
  const handleRecoverPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      await recoverPassword(email);
      setSuccessMessage("Se ha enviado un correo de recuperación.");
      setIsRecovering(false);
    } catch (err) {
      setError("Error al recuperar la contraseña.");
      console.error("Error en la recuperación:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {isRegistering ? "Registro" : isRecovering ? "Recuperar Contraseña" : "Iniciar Sesión"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

          {/* Formulaire d'inscription */}
          {isRegistering ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label>
                <Input
                  type="text"
                  placeholder="Tu nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <Input
                  type="email"
                  placeholder="correo@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <Input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-600" disabled={loading}>
                {loading ? "Registrando..." : "Registrarse"}
              </Button>
              <p className="text-center text-sm mt-2">
                ¿Ya tienes cuenta?{" "}
                <span className="text-blue-500 cursor-pointer" onClick={() => setIsRegistering(false)}>
                  Iniciar sesión
                </span>
              </p>
            </form>
          ) : isRecovering ? (
            // Formulaire de récupération de mot de passe
            <form onSubmit={handleRecoverPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <Input
                  type="email"
                  placeholder="correo@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-yellow-500 text-white hover:bg-yellow-600" disabled={loading}>
                {loading ? "Enviando..." : "Recuperar Contraseña"}
              </Button>
              <p className="text-center text-sm mt-2">
                ¿Recordaste tu contraseña?{" "}
                <span className="text-blue-500 cursor-pointer" onClick={() => setIsRecovering(false)}>
                  Iniciar sesión
                </span>
              </p>
            </form>
          ) : (
            // Formulaire de connexion
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <Input
                  type="email"
                  placeholder="correo@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <Input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600" disabled={loading}>
                {loading ? "Cargando..." : "Iniciar Sesión"}
              </Button>
              <p className="text-center text-sm mt-2">
                ¿No tienes cuenta?{" "}
                <span className="text-blue-500 cursor-pointer" onClick={() => setIsRegistering(true)}>
                  Registrarse
                </span>
              </p>
              <p className="text-center text-sm mt-2">
                ¿Olvidaste tu contraseña?{" "}
                <span className="text-blue-500 cursor-pointer" onClick={() => setIsRecovering(true)}>
                  Recuperar contraseña
                </span>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
