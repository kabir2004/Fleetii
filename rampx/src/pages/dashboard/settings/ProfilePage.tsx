import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader><CardTitle className="text-base">Profile Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl">AM</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">Change Photo</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>First Name</Label><Input defaultValue="Alex" /></div>
            <div className="space-y-1.5"><Label>Last Name</Label><Input defaultValue="Morgan" /></div>
          </div>
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" defaultValue="alex@northboundfreight.com" /></div>
          <div className="space-y-1.5"><Label>Phone</Label><Input type="tel" defaultValue="(312) 555-0192" /></div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Change Password</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5"><Label>Current Password</Label><Input type="password" placeholder="••••••••" /></div>
          <div className="space-y-1.5"><Label>New Password</Label><Input type="password" placeholder="••••••••" /></div>
          <div className="space-y-1.5"><Label>Confirm New Password</Label><Input type="password" placeholder="••••••••" /></div>
          <Button variant="outline">Update Password</Button>
        </CardContent>
      </Card>
    </div>
  )
}
