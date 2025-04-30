
import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/common/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Permission, PERMISSIONS } from '@/types';
import { getUsers, updateUser, addUser, deleteUser } from '@/utils/storage';
import { toast } from 'sonner';
import { UserList } from '@/components/admin/UserList';
import { UserDetailPanel } from '@/components/admin/UserDetailPanel';
import { EmptyStatePanel } from '@/components/admin/EmptyStatePanel';
import { NewUserPanel } from '@/components/admin/NewUserPanel';

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
  useEffect(() => {
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
    
    setShowAddUser(false);
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
  
  const handleFormChange = (field: string, value: any) => {
    setFormData({...formData, [field]: value});
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
  
  const handleCancel = () => {
    if (selectedUser?.id) {
      setIsEditing(false);
    } else {
      setShowAddUser(false);
    }
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
              <UserList 
                users={users} 
                selectedUser={selectedUser} 
                onSelectUser={selectUser} 
                onAddUser={handleAddNewUser} 
              />
            </div>
            
            {/* User Details */}
            <div className="md:col-span-8 lg:col-span-9">
              {selectedUser ? (
                <UserDetailPanel 
                  selectedUser={selectedUser}
                  formData={formData}
                  isEditing={isEditing}
                  onSetEditing={setIsEditing}
                  onFormChange={handleFormChange}
                  onPermissionChange={handlePermissionChange}
                  onSaveUser={handleSaveUser}
                  onDeleteUser={handleDeleteUser}
                  onCancel={handleCancel}
                />
              ) : showAddUser ? (
                <NewUserPanel 
                  formData={formData}
                  onFormChange={handleFormChange}
                  onPermissionChange={handlePermissionChange}
                  onSaveUser={handleSaveUser}
                  onCancel={handleCancel}
                />
              ) : (
                <EmptyStatePanel onAddUser={handleAddNewUser} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
