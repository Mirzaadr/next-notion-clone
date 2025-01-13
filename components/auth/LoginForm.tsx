import Social from "./Social";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoginForm = () => {
  return (
    <Card  className='w-[400px] shadow-md'>
      <CardHeader>
        <CardTitle className='hidden'/>
        <div className='w-full flex flex-col gap-y-4 items-center'>
          <h1 className={"text-2xl font-semibold"}>Sign In</h1>
          <p className='text-muted-foreground text-sm'>{"Welcome, please sign in to continue"}</p>
        </div>
      </CardHeader>
      <CardContent>
        <Social isGithubActive/>
      </CardContent>
    </Card>
  )
}

export default LoginForm;