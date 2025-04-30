import React, { useState } from 'react';
import { Sidebar } from '@/components/common/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Permission, PERMISSIONS } from '@/types';
import { getUsers, updateUser, addUser, deleteUser } from '@/utils/storage';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Plus, Trash, Edit, UserPlus, Users, User as UserIcon, Save } from 'lucide-react';

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(getUsers());
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  
  // Form state for new/edit user
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'cashier',
    permissions: [] as Permission[],
    isActive: true,
  });
  
  // Check if user has admin permissions
  React.useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      toast.error('No access to admin panel');
    }
  }, [isAdmin, navigate]);
  
  // Available permissions list
  const availablePermissions: Permission[] = [
    { id: PERMISSIONS.MANAGE_USERS, name: 'إدارة المستخدمين', description: 'إضافة وتعديل وحذف المستخدمين', checked: false },
    { id: PERMISSIONS.VIEW_REPORTS, name: 'عرض التقارير', description: 'الوصول إلى تقارير المبيعات والأرباح', checked: false },
    { id: PERMISSIONS.MANAGE_PRODUCTS, name: 'إدارة المنتجات', description: 'إضافة وتعديل وحذف المنتجات', checked: false },
    { id: PERMISSIONS.CREATE_ORDERS, name: 'إنشاء الطلبات', description: 'إنشاء طلبات جديدة', checked: false },
    { id: PERMISSIONS.CANCEL_ORDERS, name: 'إلغاء الطلبات', description: 'إلغاء الطلبات الحالية', checked: false },
    { id: PERMISSIONS.MODIFY_ORDERS, name: 'تعديل الطلبات', description: 'تعديل الطلبات بعد الإنشاء', checked: false },
    { id: PERMISSIONS.APPLY_DISCOUNTS, name: 'تطبيق الخصومات', description: 'إضافة خصومات على الطلبات', checked: false },
    { id: PERMISSIONS.CLOSE_REGISTER, name: 'إغلاق الصندوق', description: 'إغلاق الصندوق وتقارير نهاية اليوم', checked: false },
    { id: PERMISSIONS.KITCHEN_DISPLAY, name: 'شاشة المطبخ', description: 'الوصول إلى شاشة المطبخ', checked: false },
    { id: PERMISSIONS.ACCESS_SETTINGS, name: 'إعدادات النظام', description: 'تغيير إعدادات النظام', checked: false },
  ];
  
  const selectUser = (user: User) => {
    setSelectedUser(user);
    
    // Don't allow editing the admin user
    setIsEditing(user.role !== 'admin');
    
    // Set form data
    setFormData({
      username: user.username,
      password: user.password,
      role: user.role,
      permissions: user.permissions.length 
        ? user.permissions 
        : availablePermissions.map(p => ({ ...p, checked: false })),
      isActive: user.isActive,
    });
  };
  
  const handleAddNewUser = () => {
    // Reset form
    setFormData({
      username: '',
      password: '',
      role: 'cashier',
      permissions: availablePermissions.map(p => ({ ...p, checked: false })),
      isActive: true,
    });
    
    setShowAddUser(true);
    setSelectedUser(null);
    setIsEditing(true);
  };
  
  const handleSaveUser = () => {
    // Validation
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return;
    }
    
    if (!formData.password.trim() && !selectedUser) {
      toast.error('Password is required for new users');
      return;
    }
    
    if (selectedUser) {
      // Update existing user
      const updatedUser: User = {
        ...selectedUser,
        username: formData.username,
        password: formData.password || selectedUser.password, // Keep old password if not changed
        role: formData.role as User['role'],
        permissions: formData.permissions,
        isActive: formData.isActive,
      };
      
      updateUser(updatedUser);
      
      // Update local state
      setUsers(currentUsers => 
        currentUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
      );
      
      setSelectedUser(updatedUser);
      setIsEditing(false);
      toast.success('User updated successfully');
    } else {
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username: formData.username,
        password: formData.password,
        role: formData.role as User['role'],
        permissions: formData.permissions,
        isActive: formData.isActive,
      };
      
      addUser(newUser);
      
      // Update local state
      setUsers(currentUsers => [...currentUsers, newUser]);
      
      setShowAddUser(false);
      setSelectedUser(newUser);
      setIsEditing(false);
      toast.success('User added successfully');
    }
  };
  
  const handleDeleteUser = (userId: string) => {
    // Don't allow deleting admin user
    const user = users.find(u => u.id === userId);
    if (user?.role === 'admin') {
      toast.error('Cannot delete admin user');
      return;
    }
    
    deleteUser(userId);
    
    // Update local state
    setUsers(currentUsers => currentUsers.filter(u => u.id !== userId));
    
    if (selectedUser?.id === userId) {
      setSelectedUser(null);
    }
    
    toast.success('User deleted successfully');
  };
  
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prevData => ({
      ...prevData,
      permissions: prevData.permissions.map(p => 
        p.id === permissionId ? { ...p, checked } : p
      )
    }));
  };
  
  return (
    <div className="flex h-screen">
      <Sidebar className="w-64 hidden md:block" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="flex-1">
            <h1 className="text-lg font-semibold">إدارة المستخدمين</h1>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Users List */}
            <div className="md:col-span-4 lg:col-span-3">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">المستخدمين</CardTitle>
                    <Button size="sm" variant="outline" onClick={handleAddNewUser}>
                      <UserPlus className="h-4 w-4 ml-2" />
                      إضافة
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-1">
                  {users.map((user) => (
                    <Button
                      key={user.id}
                      variant={selectedUser?.id === user.id ? "default" : "ghost"}
                      className="justify-start"
                      onClick={() => selectUser(user)}
                    >
                      {user.role === 'admin' ? (
                        <Users className="h-4 w-4 ml-2 text-primary" />
                      ) : (
                        <UserIcon className="h-4 w-4 ml-2" />
                      )}
                      <span className={!user.isActive ? "text-muted-foreground line-through" : ""}>
                        {user.username}
                      </span>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            {/* User Details */}
            <div className="md:col-span-8 lg:col-span-9">
              {selectedUser ? (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        {isEditing ? 'تعديل المستخدم' : 'تفاصيل المستخدم'}
                      </CardTitle>
                      <div className="flex gap-2">
                        {!isEditing && selectedUser.role !== 'admin' && (
                          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            <Edit className="h-4 w-4 ml-2" />
                            تعديل
                          </Button>
                        )}
                        
                        {selectedUser.role !== 'admin' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash className="h-4 w-4 ml-2" />
                                حذف
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>حذف المستخدم</AlertDialogTitle>
                                <AlertDialogDescription>
                                  هل أنت متأكد من حذف المستخدم {selectedUser.username}؟ لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteUser(selectedUser.id)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <Tabs defaultValue="details">
                      <TabsList className="mb-4">
                        <TabsTrigger value="details">التفاصيل</TabsTrigger>
                        <TabsTrigger value="permissions">الصلاحيات</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="details" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="username">اسم المستخدم</Label>
                            <Input
                              id="username"
                              value={formData.username}
                              onChange={(e) => setFormData({...formData, username: e.target.value})}
                              disabled={!isEditing || selectedUser.role === 'admin'}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="password">كلمة المرور {isEditing && !selectedUser.id && "(مطلوب)"}</Label>
                            <Input
                              id="password"
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              disabled={!isEditing || selectedUser.role === 'admin'}
                              placeholder={selectedUser.id ? "*** (لا تغيير)" : ""}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="role">الدور</Label>
                            <select
                              id="role"
                              value={formData.role}
                              onChange={(e) => setFormData({...formData, role: e.target.value})}
                              disabled={!isEditing || selectedUser.role === 'admin'}
                              className="w-full p-2 border rounded"
                            >
                              <option value="cashier">كاشير</option>
                              <option value="kitchen">مطبخ</option>
                              {!selectedUser.id && (
                                <option value="admin">مدير</option>
                              )}
                            </select>
                          </div>
                          
                          <div className="space-y-2 flex items-end">
                            <div className="flex items-center space-x-2 rtl">
                              <Checkbox
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => 
                                  setFormData({...formData, isActive: checked === true})}
                                disabled={!isEditing || selectedUser.role === 'admin'}
                              />
                              <Label htmlFor="isActive" className="mr-2">مستخدم نشط</Label>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="permissions" className="space-y-4">
                        {selectedUser.role === 'admin' ? (
                          <div className="text-center p-4 bg-secondary rounded-md">
                            المدير يملك جميع الصلاحيات تلقائياً
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                            {availablePermissions.map((permission) => (
                              <div key={permission.id} className="flex items-start space-x-2 rtl">
                                <Checkbox
                                  id={permission.id}
                                  checked={formData.permissions.find(p => p.id === permission.id)?.checked || false}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(permission.id, checked === true)}
                                  disabled={!isEditing}
                                />
                                <div className="mr-2">
                                  <Label htmlFor={permission.id} className="font-medium">
                                    {permission.name}
                                  </Label>
                                  <p className="text-sm text-muted-foreground">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  
                  {isEditing && (
                    <CardFooter className="justify-end gap-2 border-t p-4">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          if (selectedUser.id) {
                            setIsEditing(false);
                          } else {
                            setShowAddUser(false);
                          }
                        }}
                      >
                        إلغاء
                      </Button>
                      <Button onClick={handleSaveUser}>
                        <Save className="h-4 w-4 ml-2" />
                        حفظ
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ) : showAddUser ? (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>إضافة مستخدم جديد</CardTitle>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <Tabs defaultValue="details">
                      <TabsList className="mb-4">
                        <TabsTrigger value="details">التفاصيل</TabsTrigger>
                        <TabsTrigger value="permissions">الصلاحيات</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="details" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="username">اسم المستخدم</Label>
                            <Input
                              id="username"
                              value={formData.username}
                              onChange={(e) => setFormData({...formData, username: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="password">كلمة المرور (مطلوب)</Label>
                            <Input
                              id="password"
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="role">الدور</Label>
                            <select
                              id="role"
                              value={formData.role}
                              onChange={(e) => setFormData({...formData, role: e.target.value})}
                              className="w-full p-2 border rounded"
                            >
                              <option value="cashier">كاشير</option>
                              <option value="kitchen">مطبخ</option>
                              <option value="admin">مدير</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2 flex items-end">
                            <div className="flex items-center space-x-2 rtl">
                              <Checkbox
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => 
                                  setFormData({...formData, isActive: checked === true})}
                              />
                              <Label htmlFor="isActive" className="mr-2">مستخدم نشط</Label>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="permissions" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                          {availablePermissions.map((permission) => (
                            <div key={permission.id} className="flex items-start space-x-2 rtl">
                              <Checkbox
                                id={permission.id}
                                checked={formData.permissions.find(p => p.id === permission.id)?.checked || false}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(permission.id, checked === true)}
                              />
                              <div className="mr-2">
                                <Label htmlFor={permission.id} className="font-medium">
                                  {permission.name}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {permission.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  
                  <CardFooter className="justify-end gap-2 border-t p-4">
                    <Button 
                      variant="outline"
                      onClick={() => setShowAddUser(false)}
                    >
                      إلغاء
                    </Button>
                    <Button onClick={handleSaveUser}>
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <Users className="h-16 w-16 mx-auto text-muted-foreground" />
                    <h3 className="text-lg font-medium">اختر مستخدمًا لعرض التفاصيل</h3>
                    <Button onClick={handleAddNewUser}>
                      <UserPlus className="h-4 w-4 ml-2" />
                      إضافة مستخدم جديد
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
