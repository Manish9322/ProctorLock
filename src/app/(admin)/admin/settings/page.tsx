'use client';

import { useState, useEffect } from 'react';
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
import { PlusCircle, Trash } from 'lucide-react';
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
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetGovIdTypesQuery,
  useCreateGovIdTypeMutation,
  useDeleteGovIdTypeMutation,
} from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  const { toast } = useToast();
  // Roles State and Hooks
  const { data: roles = [], isLoading: isLoadingRoles } = useGetRolesQuery({});
  const [createRole, { isLoading: isCreatingRole }] = useCreateRoleMutation();
  const [deleteRole, { isLoading: isDeletingRole }] = useDeleteRoleMutation();
  const [newRole, setNewRole] = useState('');

  // ID Types State and Hooks
  const { data: govIdTypes = [], isLoading: isLoadingIdTypes } = useGetGovIdTypesQuery({});
  const [createGovIdType, { isLoading: isCreatingIdType }] = useCreateGovIdTypeMutation();
  const [deleteGovIdType, { isLoading: isDeletingIdType }] = useDeleteGovIdTypeMutation();
  const [newIdType, setNewIdType] = useState('');

  const handleAddRole = async () => {
    if (newRole.trim()) {
      try {
        await createRole({ label: newRole, value: newRole.toLowerCase().replace(/\s+/g, '_') }).unwrap();
        setNewRole('');
        toast({ title: 'Success', description: 'New role added.' });
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Error', description: err.data?.message || 'Failed to add role.' });
      }
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      await deleteRole(id).unwrap();
      toast({ title: 'Success', description: 'Role deleted.' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.data?.message || 'Failed to delete role.' });
    }
  };

  const handleAddIdType = async () => {
    if (newIdType.trim()) {
      try {
        await createGovIdType({ label: newIdType, value: newIdType.toLowerCase().replace(/\s+/g, '_') }).unwrap();
        setNewIdType('');
        toast({ title: 'Success', description: 'New ID type added.' });
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Error', description: err.data?.message || 'Failed to add ID type.' });
      }
    }
  };

  const handleDeleteIdType = async (id: string) => {
     try {
      await deleteGovIdType(id).unwrap();
      toast({ title: 'Success', description: 'ID type deleted.' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.data?.message || 'Failed to delete ID type.' });
    }
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
                <Button onClick={handleAddRole} disabled={isCreatingRole}>
                  {isCreatingRole ? 'Adding...' : <><PlusCircle className="mr-2 h-4 w-4" /> Add Role</>}
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
                    {isLoadingRoles ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      roles.map((role: any) => (
                        <TableRow key={role._id}>
                          <TableCell className="font-medium">
                            {role.label}
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={isDeletingRole}>
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
                                  <AlertDialogAction onClick={() => handleDeleteRole(role._id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
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
                <Button onClick={handleAddIdType} disabled={isCreatingIdType}>
                  {isCreatingIdType ? 'Adding...' : <><PlusCircle className="mr-2 h-4 w-4" /> Add ID Type</>}
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
                    {isLoadingIdTypes ? (
                       Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      govIdTypes.map((idType: any) => (
                        <TableRow key={idType._id}>
                          <TableCell className="font-medium">
                            {idType.label}
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={isDeletingIdType}>
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
                                  <AlertDialogAction onClick={() => handleDeleteIdType(idType._id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
