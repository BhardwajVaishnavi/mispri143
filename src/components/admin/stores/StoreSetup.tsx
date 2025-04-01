import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/toast';

export function StoreSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const createMainStore = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stores/main', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          postalCode: data.postalCode,
          phone: data.phone,
          email: data.email,
          managerName: data.managerName,
          storeType: 'MULTI_SPECIALTY'
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast({
        title: 'Success',
        description: 'Main store created successfully',
      });
      reset();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create main store';
        
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(createMainStore)} className="space-y-4">
      <h2 className="text-xl font-bold">Create Main Store</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <input
          {...register('name')}
          placeholder="Store Name"
          className="input"
          required
        />
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          className="input"
          required
        />
        <input
          {...register('phone')}
          placeholder="Phone"
          className="input"
          required
        />
        <input
          {...register('address')}
          placeholder="Address"
          className="input"
          required
        />
        <input
          {...register('city')}
          placeholder="City"
          className="input"
          required
        />
        <input
          {...register('state')}
          placeholder="State"
          className="input"
          required
        />
        <input
          {...register('country')}
          placeholder="Country"
          className="input"
          required
        />
        <input
          {...register('postalCode')}
          placeholder="Postal Code"
          className="input"
          required
        />
        <input
          {...register('managerName')}
          placeholder="Manager Name"
          className="input"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? 'Creating...' : 'Create Main Store'}
      </button>
    </form>
  );
}

// Submit this data through the form
const mainStoreData = {
  name: "Central Bakery Hub",
  address: "123 Main Street",
  city: "Metro City",
  state: "State",
  country: "Country",
  postalCode: "12345",
  phone: "+1234567890",
  email: "central@bakeryhub.com",
  managerName: "John Smith",
  storeType: "MULTI_SPECIALTY"
};

