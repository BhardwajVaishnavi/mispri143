'use client';

import { 
  CheckCircleIcon, 
  ClockIcon, 
  TruckIcon, 
  XCircleIcon,
  DocumentCheckIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface TimelineEvent {
  status: string;
  timestamp: string;
  description: string;
  performedBy: string;
}

interface OrderStatusTimelineProps {
  timeline: TimelineEvent[];
}

export default function OrderStatusTimeline({ timeline }: OrderStatusTimelineProps) {
  // Sort timeline events by timestamp (newest first)
  const sortedTimeline = [...timeline].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
      case 'CONFIRMED':
        return <DocumentCheckIcon className="h-6 w-6 text-blue-500" />;
      case 'PROCESSING':
        return <CogIcon className="h-6 w-6 text-purple-500" />;
      case 'SHIPPED':
        return <TruckIcon className="h-6 w-6 text-indigo-500" />;
      case 'DELIVERED':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'CANCELLED':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      default:
        return <ClockIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {sortedTimeline.map((event, eventIdx) => (
          <li key={eventIdx}>
            <div className="relative pb-8">
              {eventIdx !== sortedTimeline.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-white">
                    {getStatusIcon(event.status)}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {event.description}{' '}
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime={event.timestamp}>
                      {new Date(event.timestamp).toLocaleString()}
                    </time>
                    <p className="text-xs text-gray-400">by {event.performedBy}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
