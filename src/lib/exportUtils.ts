/**
 * Export Utilities for SentimentNexus
 * Handles CSV generation and file downloads for analytical data
 */

import { AlphaSignal, MarketEvent } from '@/types';

/**
 * Escape CSV field to handle special characters
 */
const escapeCSVField = (field: string): string => {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
};

/**
 * Format date for CSV export (ISO 8601)
 */
const formatTimestamp = (date: Date): string => {
  return date.toISOString();
};

/**
 * Generate CSV content from Alpha Signals with associated events
 */
export const generateAlphaLogCSV = (
  signals: AlphaSignal[],
  events: MarketEvent[]
): string => {
  // CSV Headers
  const headers = [
    'Signal ID',
    'Event Timestamp',
    'Price Change Timestamp',
    'Alpha Lag (seconds)',
    'Price Direction',
    'Price Change ($)',
    'Rumor Content',
    'Source',
    'Reliability',
    'Market Impact',
  ].join(',');

  // Generate rows
  const rows = signals.map((signal) => {
    const associatedEvent = events.find((e) => e.id === signal.eventId);

    return [
      signal.eventId,
      formatTimestamp(signal.eventTimestamp),
      formatTimestamp(signal.priceChangeTimestamp),
      signal.lagSeconds.toFixed(2),
      signal.direction.toUpperCase(),
      signal.priceChange.toFixed(2),
      escapeCSVField(associatedEvent?.content ?? 'N/A'),
      associatedEvent?.source ?? 'N/A',
      associatedEvent?.reliability?.toUpperCase() ?? 'N/A',
      associatedEvent?.impact?.toUpperCase() ?? 'N/A',
    ].join(',');
  });

  return [headers, ...rows].join('\n');
};

/**
 * Trigger file download in browser
 */
export const downloadCSV = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};

/**
 * Export Alpha Log - Main export function
 * Generates and downloads CSV file with timestamp in filename
 */
export const exportAlphaLog = (
  signals: AlphaSignal[],
  events: MarketEvent[]
): void => {
  const csvContent = generateAlphaLogCSV(signals, events);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `sentimentnexus_alpha_log_${timestamp}.csv`;
  
  downloadCSV(csvContent, filename);
};
