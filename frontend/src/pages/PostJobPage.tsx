import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Plus, X, DollarSign, Clock, MapPin, FileText, Tag, Users } from 'lucide-react';
import { categories } from '../data/mockData';
import SmartContractJobForm from '../components/SmartContractJobForm';
import { JobService } from '../services/JobService';
import { useAuth } from '../contexts/AuthContext';

const PostJobPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [activeTab, setActiveTab] = useState<'regular' | 'smart-contract'>('regular');
  const navigate = useNavigate();
  const { user } = useAuth();

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(10, 'Job title must be at least 10 characters')
      .max(100, 'Job title must be less than 100 characters')
      .required('Job title is required'),
    category: Yup.string()
      .required('Please select a category'),
    description: Yup.string()
      .min(50, 'Job description must be at least 50 characters')
      .max(2000, 'Job description must be less than 2000 characters')
      .required('Job description is required'),
    requirements: Yup.string()
      .min(30, 'Requirements must be at least 30 characters')
      .max(1000, 'Requirements must be less than 1000 characters')
      .required('Requirements are required'),
    budget: Yup.object({
      type: Yup.string()
        .oneOf(['fixed', 'hourly'], 'Please select budget type')
        .required('Budget type is required'),
      amount: Yup.number()
        .positive('Budget amount must be positive')
        .required('Budget amount is required'),
      maxAmount: Yup.number()
        .positive('Maximum budget must be positive')
        .when('type', {
          is: 'hourly',
          then: (schema) => schema.required('Maximum hourly rate is required'),
        }),
    }),
    duration: Yup.string()
      .required('Please select project duration'),
    experience: Yup.string()
      .required('Please select experience level'),
    location: Yup.string()
      .required('Please select location type'),
    skills: Yup.array()
      .min(1, 'At least one skill is required')
      .max(10, 'Maximum 10 skills allowed'),
  });

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim()) && skills.length < 10) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      // Create job data for the service
      const jobData = {
        title: values.title,
        description: values.description,
        budget: values.budget.type === 'fixed' ? values.budget.amount : { min: values.budget.amount, max: values.budget.maxAmount },
        category: values.category,
        skills: skills,
        experience: values.experience,
        location: values.location,
        duration: values.duration,
        postedAt: new Date().toISOString().split('T')[0],
        clientId: user?.id || 'client123', // Use default client ID for demo
        postedBy: user?.name || 'Demo Client',
      };

      // Post the job using the service
      const postedJob = await JobService.postJob(jobData);
      console.log('Job posted successfully:', postedJob);
      
      // Show success message
      alert(`Job "${postedJob.title}" posted successfully! You can now view it in the Auth Demo.`);
      
      // Navigate to auth demo to see the posted job
      navigate('/auth-demo');
    } catch (error) {
      console.error('Failed to post job:', error);
      alert('Failed to post job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Post a New Job
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find the perfect freelancer for your project
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
        >
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('regular')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'regular'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Regular Job Post
            </button>
            <button
              onClick={() => setActiveTab('smart-contract')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'smart-contract'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Smart Contract Job
            </button>
          </div>
        </motion.div>

        {/* Smart Contract Form */}
        {activeTab === 'smart-contract' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SmartContractJobForm />
          </motion.div>
        )}

        {/* Regular Job Posting Form */}
        {activeTab === 'regular' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8"
          >
          <Formik
            initialValues={{
              title: '',
              category: '',
              description: '',
              requirements: '',
              budget: {
                type: 'fixed',
                amount: '',
                maxAmount: '',
              },
              duration: '',
              experience: '',
              location: '',
              skills: [],
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form className="space-y-8">
                {/* Job Title */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    <FileText className="w-5 h-5 inline mr-2" />
                    Job Title
                  </label>
                  <Field
                    type="text"
                    name="title"
                    placeholder="e.g., Senior React Developer for E-commerce Platform"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                  />
                </div>

                {/* Category and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      <Tag className="w-5 h-5 inline mr-2" />
                      Category
                    </label>
                    <Field
                      as="select"
                      name="category"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="mt-2 text-sm text-red-600 dark:text-red-400"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      <Clock className="w-5 h-5 inline mr-2" />
                      Project Duration
                    </label>
                    <Field
                      as="select"
                      name="duration"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select duration</option>
                      <option value="less-than-1-week">Less than 1 week</option>
                      <option value="1-2-weeks">1-2 weeks</option>
                      <option value="2-4-weeks">2-4 weeks</option>
                      <option value="1-3-months">1-3 months</option>
                      <option value="3-6-months">3-6 months</option>
                      <option value="more-than-6-months">More than 6 months</option>
                    </Field>
                    <ErrorMessage
                      name="duration"
                      component="div"
                      className="mt-2 text-sm text-red-600 dark:text-red-400"
                    />
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    <FileText className="w-5 h-5 inline mr-2" />
                    Job Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={6}
                    placeholder="Describe your project in detail. What needs to be accomplished? What are the goals and objectives?"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-vertical"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    <Users className="w-5 h-5 inline mr-2" />
                    Requirements & Skills
                  </label>
                  <Field
                    as="textarea"
                    name="requirements"
                    rows={4}
                    placeholder="What skills and experience should the freelancer have? List any specific requirements or qualifications."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-vertical"
                  />
                  <ErrorMessage
                    name="requirements"
                    component="div"
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    <Tag className="w-5 h-5 inline mr-2" />
                    Required Skills
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        placeholder="Add a skill (e.g., React, Node.js, UI/UX)"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        disabled={!skillInput.trim() || skills.length >= 10}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {skills.length}/10 skills added
                    </p>
                  </div>
                  <ErrorMessage
                    name="skills"
                    component="div"
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    <DollarSign className="w-5 h-5 inline mr-2" />
                    Budget
                  </label>
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <Field
                          type="radio"
                          name="budget.type"
                          value="fixed"
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Fixed Price</span>
                      </label>
                      <label className="flex items-center">
                        <Field
                          type="radio"
                          name="budget.type"
                          value="hourly"
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Hourly Rate</span>
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {values.budget.type === 'fixed' ? 'Fixed Budget' : 'Hourly Rate'}
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Field
                            type="number"
                            name="budget.amount"
                            placeholder={values.budget.type === 'fixed' ? '500' : '25'}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                        <ErrorMessage
                          name="budget.amount"
                          component="div"
                          className="mt-2 text-sm text-red-600 dark:text-red-400"
                        />
                      </div>
                      
                      {values.budget.type === 'hourly' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Maximum Hourly Rate
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Field
                              type="number"
                              name="budget.maxAmount"
                              placeholder="50"
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                          </div>
                          <ErrorMessage
                            name="budget.maxAmount"
                            component="div"
                            className="mt-2 text-sm text-red-600 dark:text-red-400"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Experience and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      <Users className="w-5 h-5 inline mr-2" />
                      Experience Level
                    </label>
                    <Field
                      as="select"
                      name="experience"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select experience level</option>
                      <option value="entry">Entry Level</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="expert">Expert</option>
                    </Field>
                    <ErrorMessage
                      name="experience"
                      component="div"
                      className="mt-2 text-sm text-red-600 dark:text-red-400"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      <MapPin className="w-5 h-5 inline mr-2" />
                      Location
                    </label>
                    <Field
                      as="select"
                      name="location"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select location type</option>
                      <option value="remote">Remote</option>
                      <option value="onsite">On-site</option>
                      <option value="hybrid">Hybrid</option>
                    </Field>
                    <ErrorMessage
                      name="location"
                      component="div"
                      className="mt-2 text-sm text-red-600 dark:text-red-400"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center text-lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Posting Job...
                      </>
                    ) : (
                      'Post Job'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </motion.div>
        )}
      </div>
    </div>
  );
};

export default PostJobPage;
