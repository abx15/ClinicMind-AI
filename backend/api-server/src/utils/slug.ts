/**
 * Slug utility functions
 */

export const generateSlug = (name: string, city: string): string => {
  // Convert to lowercase and replace spaces with hyphens
  let slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen

  // Append first 3 characters of city
  const citySuffix = city.toLowerCase().slice(0, 3).replace(/[^a-z0-9]/g, '');
  slug = `${slug}-${citySuffix}`;

  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '');

  return slug;
};

/**
 * Generate unique slug by appending number if slug already exists
 */
export const generateUniqueSlug = async (name: string, city: string, HospitalModel: any): Promise<string> => {
  const baseSlug = generateSlug(name, city);
  let slug = baseSlug;
  let counter = 1;

  // Check if slug exists, append number if needed
  while (await HospitalModel.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};
