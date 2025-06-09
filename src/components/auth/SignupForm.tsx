
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SignupFormProps {
  onSignup: (phone: string, password: string) => void;
  onSwitchToLogin: () => void;
}

const SignupForm = ({ onSignup, onSwitchToLogin }: SignupFormProps) => {
  const [phone, setPhone] = useState('+549 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Ensure it always starts with +549
    if (!value.startsWith('+549 ')) {
      value = '+549 ';
    }
    
    // Remove any non-digits after +549
    const phoneDigits = value.slice(5).replace(/\D/g, '');
    
    // Format the phone number
    if (phoneDigits.length <= 4) {
      value = '+549 ' + phoneDigits;
    } else if (phoneDigits.length <= 8) {
      value = '+549 ' + phoneDigits.slice(0, 4) + ' ' + phoneDigits.slice(4);
    } else {
      value = '+549 ' + phoneDigits.slice(0, 4) + ' ' + phoneDigits.slice(4, 8);
    }
    
    setPhone(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (phone.length < 14) {
      alert('Por favor ingresa un número de teléfono válido');
      return;
    }
    onSignup(phone, password);
  };

  return (
    <div className="mobile-container flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-sembrala-green rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <CardTitle className="text-2xl font-bold text-sembrala-blue">
            Crear Cuenta
          </CardTitle>
          <p className="text-muted-foreground">
            Únete a la revolución AgriFintech
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+549 xxxx xxxx"
                value={phone}
                onChange={handlePhoneChange}
                className="h-12 text-base"
                required
              />
              <p className="text-sm text-muted-foreground">
                Formato: +549 seguido de tu número
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Crea una contraseña segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 text-base"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-sembrala-green hover:bg-sembrala-green/90 text-base font-semibold">
              Crear Cuenta
            </Button>
          </form>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-sembrala-green hover:underline"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupForm;
