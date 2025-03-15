'use client';
import {
  MotionContainer,
  MotionItem,
  MotionHeading,
  MotionText,
  MotionTableContainer,
  MotionEmptyState,
  MotionButton
} from '@/components/animations/motion-wrapper';

import PageContainer from '@/components/layout/page-container';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

export default function AppearanceForm() {
  return (
    <PageContainer scrollable={true}>
      <div className="py-1 sm:px-4 md:space-y-4 md:p-8 lg:p-2">
        <MotionHeading className="flex items-center justify-between px-2">
          <h2 className="hidden text-2xl font-bold tracking-tight md:block">
            Profile
          </h2>
        </MotionHeading>
      </div>
      <MotionContainer className="mx-auto px-4 ">
        {/* 
      <h2 className="hidden text-xl font-bold tracking-tight md:block">
            Appearance
        </h2> */}
        <p className="text-md text-foreground">
          {' '}
          Select the theme for the dashboard.{' '}
        </p>
      </MotionContainer>
      <div className="grid max-w-md grid-cols-2 gap-8 pt-2">
        <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
          <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
            <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
              <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
            </div>
            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
              <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
            </div>
            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
              <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
            </div>
          </div>
        </div>

        <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
          <div className="space-y-2 rounded-sm bg-slate-950 p-2">
            <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
              <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
              <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
            </div>
            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
              <div className="h-4 w-4 rounded-full bg-slate-400" />
              <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
            </div>
            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
              <div className="h-4 w-4 rounded-full bg-slate-400" />
              <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
            </div>
          </div>
        </div>
        <span className="block w-full p-2 text-center font-normal">Light</span>
        <span className="block w-full p-2 text-center font-normal">Dark</span>
      </div>
    </PageContainer>
  );
}
