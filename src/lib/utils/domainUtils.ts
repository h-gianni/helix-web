/**
 * Domain utility functions for cleaning, validating and processing domain strings
 */

/**
 * Extracts the clean domain part from a URL or domain string for use in email addresses.
 *
 * Examples:
 * - "https://example.com" → "example.com"
 * - "http://www.example.com/path" → "example.com"
 * - "www.example.com" → "example.com"
 * - "example.com" → "example.com"
 * - "subdomain.example.com" → "subdomain.example.com"
 * - "example.com/path" → "example.com"
 *
 * @param domain - The domain string to process
 * @returns The trimmed domain suitable for email addresses
 */
export function trimDomain(domain: string): string {
  if (!domain || typeof domain !== "string") return "";

  try {
    // Handle URLs with protocols
    if (domain.includes("://")) {
      try {
        const url = new URL(domain);
        domain = url.hostname;
      } catch (e) {
        // If URL parsing fails, use regex fallback
        domain = domain.replace(/^(https?:\/\/)/, "");
      }
    }

    // Remove paths if present (for cases without protocol like example.com/path)
    if (domain.includes("/")) {
      domain = domain.split("/")[0];
    }

    // Remove www. prefix if present
    if (domain.startsWith("www.")) {
      domain = domain.substring(4);
    }

    // Remove trailing dots
    domain = domain.replace(/\.$/, "");

    return domain.trim().toLowerCase();
  } catch (error) {
    // Fallback for any errors
    console.error("Error trimming domain:", error);
    return domain.trim().toLowerCase();
  }
}

/**
 * Validates if a string is a properly formatted domain
 *
 * @param domain - The domain to validate
 * @returns boolean indicating if domain is valid
 */
export function isValidDomain(domain: string): boolean {
  if (!domain || typeof domain !== "string") return false;

  try {
    // First trim the domain to ensure we're working with a clean domain string
    const cleanDomain = trimDomain(domain);

    // Check if it's empty after trimming
    if (!cleanDomain) return false;

    // Domain validation regex
    // - Allows labels separated by dots
    // - Each label must start with a letter or number
    // - Labels can contain letters, numbers, and hyphens (but not start/end with a hyphen)
    // - TLD must be at least 2 characters
    const domainRegex =
      /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,}$/;

    return domainRegex.test(cleanDomain);
  } catch (error) {
    console.error("Error validating domain:", error);
    return false;
  }
}

/**
 * Extracts the root domain from a domain (removes subdomains)
 *
 * Examples:
 * - "example.com" → "example.com"
 * - "sub.example.com" → "example.com"
 * - "deep.sub.example.co.uk" → "example.co.uk"
 *
 * @param domain - The domain string to process
 * @returns The root domain
 */
export function getRootDomain(domain: string): string {
  // This is a simplified implementation that works for most common domains
  // A more comprehensive implementation would use a public suffix list

  if (!domain || typeof domain !== "string") return "";

  try {
    const cleanDomain = trimDomain(domain);
    if (!cleanDomain) return "";

    // Split the domain into parts
    const parts = cleanDomain.split(".");

    // If we have 2 or fewer parts, return as is (already a root domain)
    if (parts.length <= 2) return cleanDomain;

    // Handle special cases for country-specific second-level domains like .co.uk
    const specialTLDs = ["co.uk", "com.au", "co.nz", "co.jp", "co.za"];
    const lastTwoParts = parts.slice(-2).join(".");

    if (specialTLDs.includes(lastTwoParts)) {
      // If it's a special case, return the last three parts
      return parts.slice(-3).join(".");
    }

    // Return the last two parts (main domain + TLD)
    return parts.slice(-2).join(".");
  } catch (error) {
    console.error("Error getting root domain:", error);
    return domain;
  }
}

/**
 * Checks if a domain is valid for use in an email address
 *
 * @param domain - The domain to validate
 * @returns boolean indicating if domain is valid for email
 */
export function isValidEmailDomain(domain: string): boolean {
  if (!domain) return false;

  // First check if it's a valid domain
  const isValid = isValidDomain(domain);
  if (!isValid) return false;

  // Additional checks specific to email domains could be added here
  // For example, preventing certain TLDs or domains known for spam

  return true;
}

/**
 * Formats a domain for display purposes
 *
 * @param domain - The domain to format
 * @returns Formatted domain for display
 */
export function formatDomainForDisplay(domain: string): string {
  if (!domain) return "";

  const cleanDomain = trimDomain(domain);
  if (!cleanDomain) return "";

  // Simple formatting example - could be expanded based on requirements
  return cleanDomain;
}
