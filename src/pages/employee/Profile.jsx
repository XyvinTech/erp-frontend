import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CameraIcon, PencilIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import {
  useCurrentUser,
  useUpdateProfile,
  useUpdateProfilePicture,
} from "@/api/hooks/useAuth";
import useAuthStore from "@/store/authStore";
import useUiStore from "@/store/uiStore";
import { useEmployeeAttendance } from "@/api/hooks/useEmployee";

const Profile = () => {
  // TanStack Query hooks
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const updateProfilePictureMutation = useUpdateProfilePicture();

  // Zustand store hooks
  const { user, updateUser } = useAuthStore();
  const { addToast } = useUiStore();

  const [profilePicUrl, setProfilePicUrl] = useState(
    "/assets/images/default-avatar.png"
  );
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    total: 0,
    percentage: 0,
    leaveCount: 0,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  // Get employee attendance
  const { data: attendanceData } = useEmployeeAttendance(user?.id, {
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString(), // Start of current year
    endDate: new Date().toISOString(), // Today
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        emergencyContact: {
          name: user.emergencyContact?.name || "",
          relationship: user.emergencyContact?.relationship || "",
          phone: user.emergencyContact?.phone || "",
        },
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
          country: user.address?.country || "",
        },
      });

      if (user.profilePicture) {
        setProfilePicUrl(user.profilePicture);
      }
    }
  }, [user]);

  // Update attendance stats when attendance data changes
  useEffect(() => {
    if (attendanceData) {
      const present = attendanceData.filter(
        (a) => a.status === "present"
      ).length;
      const total = attendanceData.length;
      const absent = total - present;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      const leaveCount = attendanceData.filter(
        (a) => a.status === "leave"
      ).length;

      setAttendanceStats({
        present,
        absent,
        total,
        percentage,
        leaveCount,
      });
    }
  }, [attendanceData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      addToast({
        type: "error",
        message: "Please select an image file",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast({
        type: "error",
        message: "Image size should be less than 5MB",
      });
      return;
    }

    try {
      // Create form data
      const formData = new FormData();
      formData.append("profilePicture", file);

      // Update profile picture
      await updateProfilePictureMutation.mutateAsync(formData);

      // Show success message
      addToast({
        type: "success",
        message: "Profile picture updated successfully",
      });

      // Update local state
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      addToast({
        type: "error",
        message: error.message || "Failed to update profile picture",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      // Update profile
      await updateProfileMutation.mutateAsync(formData);

      // Show success message
      addToast({
        type: "success",
        message: "Profile updated successfully",
      });

      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      addToast({
        type: "error",
        message: error.message || "Failed to update profile",
      });
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <Card className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={profilePicUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button
                  onClick={handleImageClick}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                >
                  <CameraIcon className="h-5 w-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <h2 className="mt-4 text-xl font-bold">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-500">
                {user?.position?.name || "Employee"}
              </p>
              <p className="text-gray-500">
                {user?.department?.name || "Department"}
              </p>

              <div className="mt-6 w-full">
                <div className="flex justify-between text-sm mb-2">
                  <span>Profile Completion</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Attendance Stats Card */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Present</span>
                  <span>{attendanceStats.present} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${attendanceStats.percentage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Absent</span>
                  <span>{attendanceStats.absent} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${
                        attendanceStats.total > 0
                          ? (attendanceStats.absent / attendanceStats.total) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Leave</span>
                  <span>{attendanceStats.leaveCount} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${
                        attendanceStats.total > 0
                          ? (attendanceStats.leaveCount /
                              attendanceStats.total) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium">Attendance Rate</span>
                  <span className="font-medium text-green-600">
                    {attendanceStats.percentage}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="md:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Personal Information</h3>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PencilIcon className="h-4 w-4" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  {isEditing ? (
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  {isEditing ? (
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full"
                      disabled
                    />
                  ) : (
                    <p className="text-gray-900">{formData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  {isEditing ? (
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {formData.phone || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium mb-4">Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    {isEditing ? (
                      <Input
                        name="emergencyContact.name"
                        value={formData.emergencyContact.name}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formData.emergencyContact.name || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship
                    </label>
                    {isEditing ? (
                      <Input
                        name="emergencyContact.relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formData.emergencyContact.relationship ||
                          "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    {isEditing ? (
                      <Input
                        name="emergencyContact.phone"
                        value={formData.emergencyContact.phone}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formData.emergencyContact.phone || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium mb-4">Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street
                    </label>
                    {isEditing ? (
                      <Input
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formData.address.street || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    {isEditing ? (
                      <Input
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formData.address.city || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    {isEditing ? (
                      <Input
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formData.address.state || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code
                    </label>
                    {isEditing ? (
                      <Input
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formData.address.zipCode || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    {isEditing ? (
                      <Input
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formData.address.country || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
