import * as React from "react";
import Header from "@/components/ui/header/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes"
import { useRouter } from 'next/navigation'

export default function Login() {
  const { setTheme } = useTheme()
  const router = useRouter()

  setTheme("dark")

  return (
    <div>
      <Header></Header>
    <div className="flex items-center justify-center min-h-screen">
      <Card style={{backgroundColor: 'white'}} className="w-[450px] relative -top-12">
        <CardHeader>
          <CardTitle>Admin</CardTitle>
          <CardDescription>
           Sistema de gerenciamento de projetos do Criarte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="name" type="email" placeholder="Digite seu email" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="Digite sua senha" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={() => router.push('/dash')}>Entrar</Button>
        </CardFooter>
      </Card>
    </div>
    </div>
  );
}
