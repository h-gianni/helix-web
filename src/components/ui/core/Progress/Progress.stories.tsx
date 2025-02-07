import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './index';
import { useState, useEffect } from 'react';

const meta = {
  title: 'Core/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A progress indicator component that displays the completion status of a task or process.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof Progress>;

// Static states
export const States: Story = {
  render: () => (
    <div className="w-[400px] space-y-8">
      <div className="space-y-2">
        <div className="text-sm text-gray-500">Empty (0%)</div>
        <Progress value={0} />
      </div>
      <div className="space-y-2">
        <div className="text-sm text-gray-500">Partial (40%)</div>
        <Progress value={40} />
      </div>
      <div className="space-y-2">
        <div className="text-sm text-gray-500">Most (80%)</div>
        <Progress value={80} />
      </div>
      <div className="space-y-2">
        <div className="text-sm text-gray-500">Complete (100%)</div>
        <Progress value={100} />
      </div>
    </div>
  ),
};

// Animated Progress
export const AnimatedProgress: Story = {
  render: function Render() {
    const [progress, setProgress] = useState(13);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prevProgress) => 
          prevProgress >= 100 ? 0 : prevProgress + 3
        );
      }, 500);

      return () => clearInterval(timer);
    }, []);

    return (
      <div className="w-[400px] space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Uploading files...</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
    );
  },
};

// Upload Progress Example
export const UploadProgress: Story = {
  render: function Render() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        setProgress(66);
      }, 500);
      
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="w-[400px] space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div>
              <span className="font-medium">uploading.pdf</span>
              <p className="text-gray-500 text-xs">2.5MB of 4.2MB</p>
            </div>
            <div className="text-gray-500">{progress}%</div>
          </div>
          <Progress value={progress} />
        </div>
      </div>
    );
  },
};

// Multiple Progress Indicators
export const MultipleProgress: Story = {
  render: function Render() {
    const items = [
      { name: 'Processing images', progress: 100 },
      { name: 'Compressing files', progress: 75 },
      { name: 'Uploading assets', progress: 35 },
    ];

    return (
      <div className="w-[400px] space-y-6">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{item.name}</span>
              <span className="text-gray-500">{item.progress}%</span>
            </div>
            <Progress value={item.progress} />
          </div>
        ))}
      </div>
    );
  },
};

// Loading Progress
export const LoadingProgress: Story = {
  render: function Render() {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Preparing...');

    useEffect(() => {
      const stages = [
        { progress: 0, status: 'Preparing...' },
        { progress: 35, status: 'Loading assets...' },
        { progress: 68, status: 'Processing...' },
        { progress: 100, status: 'Complete!' },
      ];
      
      let currentStage = 0;
      
      const timer = setInterval(() => {
        if (currentStage < stages.length) {
          setProgress(stages[currentStage].progress);
          setStatus(stages[currentStage].status);
          currentStage += 1;
        } else {
          clearInterval(timer);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }, []);

    return (
      <div className="w-[400px] space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{status}</span>
          <span className="text-gray-500">{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
    );
  },
};