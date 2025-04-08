
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Visitor, asVisitors } from '@/types/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const VisitorsTab = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [visitorCount, setVisitorCount] = useState(0);
  const [pageViewsByPath, setPageViewsByPath] = useState<{[key: string]: number}>({});

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const { data, error } = await supabase
          .from('visitors')
          .select('*')
          .order('visited_at', { ascending: false });

        if (error) throw error;

        const typedVisitors = asVisitors(data || []);
        setVisitors(typedVisitors);
        setVisitorCount(typedVisitors.length);
        
        // Calculate page views by path
        const viewsByPath = typedVisitors.reduce((acc, visitor) => {
          const path = visitor.page_visited || 'unknown';
          acc[path] = (acc[path] || 0) + 1;
          return acc;
        }, {} as {[key: string]: number});
        
        setPageViewsByPath(viewsByPath);
      } catch (error) {
        console.error('Error fetching visitors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-saffire-blue border-gray-200 mb-4"></div>
        <p className="text-gray-500">Loading visitor data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-4xl font-bold text-saffire-blue">{visitorCount}</div>
            <p className="text-gray-600">Total Visitors</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-4xl font-bold text-saffire-purple">
              {Object.keys(pageViewsByPath).length}
            </div>
            <p className="text-gray-600">Unique Pages Visited</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-4xl font-bold text-saffire-darkBlue">
              {visitors.length > 0 
                ? new Date(visitors[0].visited_at || '').toLocaleDateString() 
                : '-'}
            </div>
            <p className="text-gray-600">Most Recent Visit</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Page Visits by Path</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page Path</TableHead>
                  <TableHead className="text-right">Visits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(pageViewsByPath).length > 0 ? (
                  Object.entries(pageViewsByPath)
                    .sort((a, b) => b[1] - a[1])
                    .map(([path, count]) => (
                      <TableRow key={path}>
                        <TableCell>{path}</TableCell>
                        <TableCell className="text-right">{count}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-gray-500">
                      No page visits recorded
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visited At</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>User Agent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitors.slice(0, 10).map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell>
                      {visitor.visited_at 
                        ? new Date(visitor.visited_at).toLocaleString() 
                        : 'Unknown'}
                    </TableCell>
                    <TableCell>{visitor.page_visited || 'Unknown'}</TableCell>
                    <TableCell className="truncate max-w-xs">
                      {visitor.user_agent || 'Unknown'}
                    </TableCell>
                  </TableRow>
                ))}
                {visitors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      No visitors recorded
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorsTab;
