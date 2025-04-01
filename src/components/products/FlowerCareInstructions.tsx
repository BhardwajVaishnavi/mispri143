'use client';

import { Card } from '@/components/ui/card';
import { 
  SunIcon, 
  DropletIcon, 
  BeakerIcon, 
  ClockIcon, 
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

interface CareInstructionsProps {
  careInstructions?: {
    wateringFrequency?: string;
    sunlightNeeds?: string;
    temperature?: string;
    shelfLife?: string;
    storageInfo?: string;
    additionalNotes?: string;
  };
}

export default function FlowerCareInstructions({ careInstructions }: CareInstructionsProps) {
  if (!careInstructions) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No care instructions available for this product.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Care Instructions</h3>
      <p className="text-gray-700">
        Follow these care instructions to keep your flowers fresh and beautiful for as long as possible.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {careInstructions.wateringFrequency && (
          <Card className="p-4">
            <div className="flex items-start space-x-3">
              <DropletIcon className="h-6 w-6 text-blue-500 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Watering</h4>
                <p className="text-sm text-gray-600">{careInstructions.wateringFrequency}</p>
              </div>
            </div>
          </Card>
        )}

        {careInstructions.sunlightNeeds && (
          <Card className="p-4">
            <div className="flex items-start space-x-3">
              <SunIcon className="h-6 w-6 text-yellow-500 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Sunlight</h4>
                <p className="text-sm text-gray-600">{careInstructions.sunlightNeeds}</p>
              </div>
            </div>
          </Card>
        )}

        {careInstructions.temperature && (
          <Card className="p-4">
            <div className="flex items-start space-x-3">
              <BeakerIcon className="h-6 w-6 text-red-500 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Temperature</h4>
                <p className="text-sm text-gray-600">{careInstructions.temperature}</p>
              </div>
            </div>
          </Card>
        )}

        {careInstructions.shelfLife && (
          <Card className="p-4">
            <div className="flex items-start space-x-3">
              <ClockIcon className="h-6 w-6 text-purple-500 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Shelf Life</h4>
                <p className="text-sm text-gray-600">{careInstructions.shelfLife}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {careInstructions.storageInfo && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Storage Information</h4>
          <p className="text-gray-700">{careInstructions.storageInfo}</p>
        </div>
      )}

      {careInstructions.additionalNotes && (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="h-6 w-6 text-blue-500 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Additional Notes</h4>
              <p className="text-sm text-gray-700">{careInstructions.additionalNotes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
