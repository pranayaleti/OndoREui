import type { ApiProperty, Property } from '@/app/types/property';

const fullName = (c?: {
  firstName?: string | null;
  lastName?: string | null;
}) => [c?.firstName, c?.lastName].filter(Boolean).join(' ').trim();

export function mapApiProperty(p: ApiProperty): Property {
  const images = (p.photos ?? [])
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    .map((ph) => ph.url);

  const managerName = fullName(p.manager || undefined);
  const ownerName = fullName(p.owner || undefined);

  const contactPhone = p.manager?.phone?.trim() || p.phone?.trim() || '';

  const contactEmail = p.manager?.email?.trim() || p.owner?.email?.trim() || '';

  const contactRole: 'manager' | 'owner' | 'property' =
    p.manager?.phone || p.manager?.email
      ? 'manager'
      : p.owner?.phone || p.owner?.email
      ? 'owner'
      : 'property';

  const contactName =
    (contactRole === 'manager' && managerName) ||
    (contactRole === 'owner' && ownerName) ||
    (p.title ?? 'Contact');

  const address = [
    p.addressLine1,
    p.addressLine2,
    [p.city, p.state].filter(Boolean).join(', '),
    [p.country, p.zipcode].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join(', ');

  return {
    id: p.publicId,
    title: p.title,
    type: p.type,
    address,
    price: p.price,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    sqft: p.sqft,
    phone: p.phone ?? '',
    website: p.website,
    leaseTerms: p.leaseTerms,
    fees: p.fees,
    availability: p.availability,
    rating: typeof p.rating === 'string' ? parseFloat(p.rating) : p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    amenities: p.amenities ?? [],
    specialties: p.specialties ?? [],
    services: p.services ?? [],
    valueRanges: p.valueRanges ?? [],
    images,
    image: images[0] ?? '/placeholder.svg',
    dateAdded: new Date(p.createdAt),
    logo: '/placeholder.svg?height=80&width=80',
    description: p.description ?? '',
    addressParts: {
      line1: p.addressLine1,
      line2: p.addressLine2,
      city: p.city,
      state: p.state,
      country: p.country,
      zipcode: p.zipcode,
    },
    lat: p.lat ?? null,
    lng: p.lng ?? null,
    contact: {
      name: contactName,
      phone: contactPhone,
      email: contactEmail,
      role: contactRole,
    },
  };
}
