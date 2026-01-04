'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { registrationOptions } from '@/lib/config-data';

export default function SettingsPage() {
  const [roles, setRoles] = useState(registrationOptions.roles);
  const [govIdTypes, setGovIdTypes] = useState(
    registrationOptions.govIdTypes
  );
  const [newRole, setNewRole] = useState('');
  const [newIdType, setNewIdType] = useState('');

  const handleAddRole = () => {
    if (newRole.trim()) {
      setRoles([
        ...roles,
        { value: newRole.toLowerCase().replace(/\s+/g, '_'), label: newRole },
      ]);
      setNewRole('');
    }
  };

  const handleAddIdType = () => {
    if (newIdType.trim()) {
      setGovIdTypes([
        ...govIdTypes,
        {
          value: newIdType.toLowerCase().replace(/\s+/g, '_'),
          label: newIdType,
        },
      ]);
      setNewIdType('');
    }
  };

  const handleDeleteRole = (value: string) => {
    setRoles(roles.filter((role) => role.value !== value));
  };

  const handleDeleteIdType = (value: string) => {
    setGovIdTypes(govIdTypes.filter((idType) => idType.value !== value));
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your administrator preferences and registration options.
        </p>
      </div>

      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="id-types">ID Types</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Admin Preferences</CardTitle>
              <CardDescription>
                Manage your account and settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Admin User" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="admin@example.com"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Manage Roles</CardTitle>
              <CardDescription>
                Add or remove roles available during registration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="New role name..."
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                />
                <Button onClick={handleAddRole}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Role
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead className="w-[50px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.value}>
                        <TableCell className="font-medium">
                          {role.label}
                        </TableCell>
                        <TableCell className="text-right">
                           <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the role "{role.label}".
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteRole(role.value)}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Role Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="id-types">
          <Card>
            <CardHeader>
              <CardTitle>Manage Government ID Types</CardTitle>
              <CardDescription>
                Add or remove ID types for registration verification.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="New ID type name..."
                  value={newIdType}
                  onChange={(e) => setNewIdType(e.target.value)}
                />
                <Button onClick={handleAddIdType}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add ID Type
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Type Name</TableHead>
                      <TableHead className="w-[50px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {govIdTypes.map((idType) => (
                      <TableRow key={idType.value}>
                        <TableCell className="font-medium">
                          {idType.label}
                        </TableCell>
                         <TableCell className="text-right">
                           <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the ID type "{idType.label}".
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteIdType(idType.value)}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save ID Type Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
