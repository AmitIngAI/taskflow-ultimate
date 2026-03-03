import { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Shield,
  Edit,
  Trash2,
  UserPlus
} from 'lucide-react';
import { 
  Button, 
  Card, 
  Avatar, 
  Badge, 
  Input, 
  Modal,
  Dropdown,
  DropdownItem,
  EmptyState 
} from '../components/common';
import { USER_ROLES } from '../constants/config';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Team = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  // Mock team data
  const [teamMembers, setTeamMembers] = useState([
    {
      id: '1',
      name: 'HAKKA',
      email: 'hakka@taskflow.com',
      role: USER_ROLES.ADMIN,
      phone: '+91 98765 43210',
      location: 'Mumbai, India',
      avatar: null,
      status: 'online',
      tasksCompleted: 45,
      tasksInProgress: 8,
      joinedAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@taskflow.com',
      role: USER_ROLES.MANAGER,
      phone: '+1 234 567 8900',
      location: 'New York, USA',
      avatar: 'https://i.pravatar.cc/150?img=1',
      status: 'online',
      tasksCompleted: 38,
      tasksInProgress: 5,
      joinedAt: '2024-02-01',
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael@taskflow.com',
      role: USER_ROLES.DEVELOPER,
      phone: '+1 234 567 8901',
      location: 'San Francisco, USA',
      avatar: 'https://i.pravatar.cc/150?img=2',
      status: 'away',
      tasksCompleted: 52,
      tasksInProgress: 3,
      joinedAt: '2024-02-15',
    },
    {
      id: '4',
      name: 'Emily Rodriguez',
      email: 'emily@taskflow.com',
      role: USER_ROLES.DEVELOPER,
      phone: '+1 234 567 8902',
      location: 'Los Angeles, USA',
      avatar: 'https://i.pravatar.cc/150?img=3',
      status: 'offline',
      tasksCompleted: 29,
      tasksInProgress: 6,
      joinedAt: '2024-03-01',
    },
    {
      id: '5',
      name: 'David Kim',
      email: 'david@taskflow.com',
      role: USER_ROLES.QA,
      phone: '+1 234 567 8903',
      location: 'Seattle, USA',
      avatar: 'https://i.pravatar.cc/150?img=4',
      status: 'online',
      tasksCompleted: 67,
      tasksInProgress: 12,
      joinedAt: '2024-03-10',
    },
  ]);

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleColors = {
    [USER_ROLES.ADMIN]: 'danger',
    [USER_ROLES.MANAGER]: 'warning',
    [USER_ROLES.DEVELOPER]: 'info',
    [USER_ROLES.QA]: 'success',
    [USER_ROLES.VIEWER]: 'default',
  };

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-400',
  };

  const handleRemoveMember = (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      setTeamMembers(prev => prev.filter(m => m.id !== memberId));
      toast.success('Team member removed');
    }
  };

  const handleInviteMember = (e) => {
    e.preventDefault();
    toast.success('Invitation sent successfully!');
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Team
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your team members and permissions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search members..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          
          {/* View Toggle */}
          <div className="flex bg-gray-100 dark:bg-dark-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-dark-700 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-dark-700 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              List
            </button>
          </div>

          <Button onClick={() => setShowInviteModal(true)} icon={UserPlus}>
            Invite Member
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary-600">{teamMembers.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Members</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-green-600">
            {teamMembers.filter(m => m.status === 'online').length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Online Now</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-blue-600">
            {teamMembers.reduce((acc, m) => acc + m.tasksCompleted, 0)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tasks Completed</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-yellow-600">
            {teamMembers.reduce((acc, m) => acc + m.tasksInProgress, 0)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">In Progress</p>
        </Card>
      </div>

      {/* Team Members */}
      {filteredMembers.length === 0 ? (
        <EmptyState
          title="No members found"
          description="Try adjusting your search or invite new team members"
          actionLabel="Invite Member"
          onAction={() => setShowInviteModal(true)}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card hoverable className="relative">
                {/* Status Indicator */}
                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${statusColors[member.status]}`} />

                {/* Dropdown Menu */}
                <div className="absolute top-4 right-10">
                  <Dropdown
                    trigger={
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    }
                    align="right"
                  >
                    <DropdownItem icon={Edit} onClick={() => setSelectedMember(member)}>
                      Edit
                    </DropdownItem>
                    <DropdownItem icon={Mail} onClick={() => window.location.href = `mailto:${member.email}`}>
                      Send Email
                    </DropdownItem>
                    <DropdownItem icon={Trash2} onClick={() => handleRemoveMember(member.id)} danger>
                      Remove
                    </DropdownItem>
                  </Dropdown>
                </div>

                {/* Avatar & Info */}
                <div className="text-center mb-4">
                  <Avatar
                    src={member.avatar}
                    fallback={member.name}
                    size="xl"
                    className="mx-auto mb-3"
                  />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {member.email}
                  </p>
                  <Badge variant={roleColors[member.role]} className="mt-2">
                    <Shield className="w-3 h-3 mr-1" />
                    {member.role}
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {member.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {member.location}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-dark-700">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {member.tasksCompleted}
                    </p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {member.tasksInProgress}
                    </p>
                    <p className="text-xs text-gray-500">In Progress</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden p-0">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Member</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Role</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Tasks</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={member.avatar} fallback={member.name} size="sm" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={roleColors[member.role]}>{member.role}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusColors[member.status]}`} />
                      <span className="text-sm capitalize">{member.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{member.tasksCompleted} completed, {member.tasksInProgress} active</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Dropdown
                      trigger={
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      }
                      align="right"
                    >
                      <DropdownItem icon={Edit}>Edit</DropdownItem>
                      <DropdownItem icon={Mail}>Send Email</DropdownItem>
                      <DropdownItem icon={Trash2} onClick={() => handleRemoveMember(member.id)} danger>
                        Remove
                      </DropdownItem>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Member"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteMember}>
              Send Invitation
            </Button>
          </>
        }
      >
        <form onSubmit={handleInviteMember} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="colleague@company.com"
            icon={Mail}
            required
          />
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <select className="input">
              <option value={USER_ROLES.DEVELOPER}>Developer</option>
              <option value={USER_ROLES.QA}>QA</option>
              <option value={USER_ROLES.MANAGER}>Manager</option>
              <option value={USER_ROLES.VIEWER}>Viewer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Personal Message (Optional)
            </label>
            <textarea
              className="input"
              rows={3}
              placeholder="Hey! Join our team on TaskFlow..."
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Team;