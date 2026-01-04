'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Users,
  FileText,
  Clock,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  FileJson,
  BarChart,
  PieChartIcon,
} from 'lucide-react';
import {
  Bar,
  BarChart as RechartsBarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const userGrowthData = [
  { month: 'Jan', users: 50 },
  { month: 'Feb', users: 75 },
  { month: 'Mar', users: 120 },
  { month: 'Apr', users: 150 },
  { month: 'May', users: 200 },
  { month: 'Jun', users: 230 },
];

const testSessionsData = [
  { name: 'Morning', value: 400 },
  { name: 'Afternoon', value: 300 },
  { name: 'Evening', value: 300 },
  { name: 'Night', value: 200 },
];

const testStatusData = [
  { name: 'Finished', value: 240, fill: 'var(--color-finished)' },
  { name: 'Active', value: 45, fill: 'var(--color-active)' },
  { name: 'Flagged', value: 30, fill: 'var(--color-flagged)' },
  { name: 'Draft', value: 15, fill: 'var(--color-draft)' },
];

const chartConfig = {
  users: {
    label: 'Users',
    color: 'hsl(var(--primary))',
  },
  sessions: {
    label: 'Sessions',
    color: 'hsl(var(--accent))',
  },
  finished: {
    label: 'Finished',
    color: 'hsl(var(--chart-2))',
  },
  active: {
    label: 'Active',
    color: 'hsl(var(--chart-1))',
  },
  flagged: {
    label: 'Flagged',
    color: 'hsl(var(--destructive))',
  },
  draft: {
    label: 'Draft',
    color: 'hsl(var(--muted-foreground))',
  },
};

const reportData = {
  candidateReport: [
    { id: 'user1', name: 'Alice', status: 'Finished', score: 88 },
    { id: 'user2', name: 'Bob', status: 'Flagged', score: 65 },
    { id: 'user3', name: 'Charlie', status: 'Finished', score: 92 },
  ],
  testReport: [
    { id: 'CS101', title: 'Intro to CS', status: 'Finished', candidates: 120 },
    { id: 'MA203', title: 'Calculus II', status: 'Active', candidates: 80 },
    { id: 'PHY201', title: 'Physics I', status: 'Finished', candidates: 95 },
  ],
};

function ReportModal({
  title,
  description,
  data,
  headers,
}: {
  title: string;
  description: string;
  data: any[];
  headers: string[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {headers.map((h) => (
                    <TableCell key={h}>{row[h.toLowerCase().replace(' ', '_')]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="secondary">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Download as CSV
          </Button>
          <Button>
            <FileJson className="mr-2 h-4 w-4" /> Download as Excel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Detailed insights into your proctoring activities.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">
              +120 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">312</div>
            <p className="text-xs text-muted-foreground">+45 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Session Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48m</div>
            <p className="text-xs text-muted-foreground">
              -2m from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Flags
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +15 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly new user registrations.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <RechartsBarChart accessibilityLayer data={userGrowthData}>
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="users" fill="var(--color-users)" radius={4} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Test Sessions by Time of Day</CardTitle>
            <CardDescription>Peak hours for test-taking.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <RechartsBarChart accessibilityLayer data={testSessionsData} layout="vertical">
                 <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false}/>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="value" layout="vertical" fill="var(--color-sessions)" radius={4} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test Status Distribution</CardTitle>
            <CardDescription>Overview of all created tests.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="name" hideLabel />}
                />
                <Pie data={testStatusData} dataKey="value" nameKey="name" label>
                   {testStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Downloadable Reports</CardTitle>
            <CardDescription>Generate and download detailed reports for your records.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-medium">Candidate Report</CardTitle>
                    <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Full list of all candidates and their status.</p>
                </CardContent>
                <CardFooter>
                    <ReportModal 
                        title="Candidate Report" 
                        description="Detailed list of all candidates." 
                        data={reportData.candidateReport}
                        headers={['ID', 'Name', 'Status', 'Score']}
                    />
                </CardFooter>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-medium">Test & Session Report</CardTitle>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Comprehensive data on all tests and sessions.</p>
                </CardContent>
                <CardFooter>
                    <ReportModal 
                        title="Test & Session Report"
                        description="Detailed list of all tests and their sessions."
                        data={reportData.testReport}
                        headers={['ID', 'Title', 'Status', 'Candidates']}
                    />
                </CardFooter>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
