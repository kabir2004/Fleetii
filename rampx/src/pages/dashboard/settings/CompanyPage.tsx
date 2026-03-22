import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MOCK_COMPANY } from '@/lib/mockData'

export default function CompanyPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader><CardTitle className="text-base">Company Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5"><Label>Company Name</Label><Input defaultValue={MOCK_COMPANY.name} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>DOT Number</Label><Input defaultValue={MOCK_COMPANY.dot_number ?? ''} /></div>
            <div className="space-y-1.5"><Label>MC Number</Label><Input defaultValue={MOCK_COMPANY.mc_number ?? ''} /></div>
          </div>
          <div className="space-y-1.5"><Label>EIN</Label><Input defaultValue={MOCK_COMPANY.ein ?? ''} /></div>
          <div className="space-y-1.5"><Label>Phone</Label><Input defaultValue={MOCK_COMPANY.phone ?? ''} /></div>
          <div className="space-y-1.5"><Label>Street Address</Label><Input defaultValue={MOCK_COMPANY.address.street} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5 col-span-2"><Label>City</Label><Input defaultValue={MOCK_COMPANY.address.city} /></div>
            <div className="space-y-1.5"><Label>State</Label><Input defaultValue={MOCK_COMPANY.address.state} /></div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}
