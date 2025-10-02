'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, Mail, Phone, MapPin, GraduationCap, Award, FileText } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  pharmacyName: string;
  drugLicenseNumber: string;
  role: 'ADMIN' | 'PHARMACIST';
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  profile?: {
    phone?: string;
    specialization?: string;
    address?: string;
    licenseNumber?: string;
    qualifications?: string;
    experience?: number;
    bio?: string;
  };
  subscription?: {
    tier: string;
    isActive: boolean;
    expiresAt?: string;
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    pharmacyName: '',
    drugLicenseNumber: '',
  });

  const [profileInfo, setProfileInfo] = useState({
    phone: '',
    specialization: '',
    address: '',
    licenseNumber: '',
    qualifications: '',
    experience: 0,
    bio: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Get current user ID from session or API
      const response = await fetch('/api/auth/me');
      const userData = await response.json();
      
      if (userData.user) {
        const profileResponse = await fetch(`/api/users/management/${userData.user.id}`);
        const profileData = await profileResponse.json();
        
        setProfile(profileData.user);
        setBasicInfo({
          name: profileData.user.name,
          email: profileData.user.email,
          phoneNumber: profileData.user.phoneNumber,
          pharmacyName: profileData.user.pharmacyName,
          drugLicenseNumber: profileData.user.drugLicenseNumber,
        });
        setProfileInfo({
          phone: profileData.user.profile?.phone || '',
          specialization: profileData.user.profile?.specialization || '',
          address: profileData.user.profile?.address || '',
          licenseNumber: profileData.user.profile?.licenseNumber || '',
          qualifications: profileData.user.profile?.qualifications || '',
          experience: profileData.user.profile?.experience || 0,
          bio: profileData.user.profile?.bio || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/users/management/${profile?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: basicInfo.name,
          phoneNumber: basicInfo.phoneNumber,
        }),
      });

      if (response.ok) {
        await fetchProfile();
        alert('Basic information updated successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update basic information');
      }
    } catch (error) {
      console.error('Error updating basic info:', error);
      alert('Failed to update basic information');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileInfoSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/users/management/${profile?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: profileInfo,
        }),
      });

      if (response.ok) {
        await fetchProfile();
        alert('Profile information updated successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update profile information');
      }
    } catch (error) {
      console.error('Error updating profile info:', error);
      alert('Failed to update profile information');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRoleIcon = (role: string) => {
    return role === 'ADMIN' ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />;
  };

  const getRoleColor = (role: string) => {
    return role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-gray-600">Manage your account information and settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getRoleColor(profile.role)}>
            <span className="flex items-center">
              {getRoleIcon(profile.role)}
              <span className="ml-1">{profile.role}</span>
            </span>
          </Badge>
          <Badge variant={profile.isActive ? 'default' : 'secondary'}>
            {profile.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
          <CardDescription>Your account summary and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Name</span>
              </div>
              <p className="text-lg font-semibold">{profile.name}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Email</span>
              </div>
              <p className="text-lg font-semibold">{profile.email}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Phone</span>
              </div>
              <p className="text-lg font-semibold">{profile.phoneNumber}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Pharmacy</span>
              </div>
              <p className="text-lg font-semibold">{profile.pharmacyName}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">License</span>
              </div>
              <p className="text-lg font-semibold">{profile.drugLicenseNumber}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Last Login</span>
              </div>
              <p className="text-lg font-semibold">
                {profile.lastLoginAt ? formatDate(profile.lastLoginAt) : 'Never'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="profile">Professional Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your basic account information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBasicInfoSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={basicInfo.name}
                      onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={basicInfo.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={basicInfo.phoneNumber}
                      onChange={(e) => setBasicInfo({ ...basicInfo, phoneNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pharmacyName">Pharmacy Name</Label>
                    <Input
                      id="pharmacyName"
                      value={basicInfo.pharmacyName}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">Pharmacy name cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="drugLicenseNumber">Drug License Number</Label>
                    <Input
                      id="drugLicenseNumber"
                      value={basicInfo.drugLicenseNumber}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">License number cannot be changed</p>
                  </div>
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professional Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Professional Profile</CardTitle>
              <CardDescription>Update your professional information and qualifications</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileInfoSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Phone</Label>
                    <Input
                      id="phone"
                      value={profileInfo.phone}
                      onChange={(e) => setProfileInfo({ ...profileInfo, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={profileInfo.specialization}
                      onChange={(e) => setProfileInfo({ ...profileInfo, specialization: e.target.value })}
                      placeholder="e.g., Clinical Pharmacy, Oncology"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Professional License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={profileInfo.licenseNumber}
                      onChange={(e) => setProfileInfo({ ...profileInfo, licenseNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={profileInfo.experience}
                      onChange={(e) => setProfileInfo({ ...profileInfo, experience: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="qualifications">Educational Qualifications</Label>
                    <Textarea
                      id="qualifications"
                      value={profileInfo.qualifications}
                      onChange={(e) => setProfileInfo({ ...profileInfo, qualifications: e.target.value })}
                      placeholder="e.g., B.Pharm, M.Pharm, Pharm.D"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={profileInfo.address}
                      onChange={(e) => setProfileInfo({ ...profileInfo, address: e.target.value })}
                      placeholder="Your professional address"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileInfo.bio}
                      onChange={(e) => setProfileInfo({ ...profileInfo, bio: e.target.value })}
                      placeholder="Tell us about yourself and your professional background"
                      rows={4}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and authentication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-gray-600">Change your account password</p>
                  <Button variant="outline">Change Password</Button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Login Activity</h4>
                  <p className="text-sm text-gray-600">View your recent login activity</p>
                  <div className="text-sm">
                    <p>Last login: {profile.lastLoginAt ? formatDate(profile.lastLoginAt) : 'Never'}</p>
                    <p>Account created: {formatDate(profile.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
