import React from 'react';
import {
  Document, Page, Text, View, StyleSheet,
} from '@react-pdf/renderer';
import { AIAnalysis } from '@/lib/api/calculators';

interface PDFProps {
  calculatorType: string;
  title: string;
  inputs: Record<string, string>;
  results: Record<string, string>;
  analysis?: AIAnalysis;
  location?: string;
  generatedAt: Date;
}

const PDF_THEME = {
  page: '#ffffff',
  header: '#131a25',
  primary: '#f97316',
  scoreBar: '#242e3f',
  aiSection: '#fff7ed',
  inputPill: '#f3f4f6',
} as const;

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: PDF_THEME.page, padding: 32 },
  header: { backgroundColor: PDF_THEME.header, padding: 16, marginBottom: 16, borderRadius: 4 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brandText: { color: '#f97316', fontSize: 10, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  titleText: { color: '#f9fafb', fontSize: 9, fontFamily: 'Helvetica-Bold', marginTop: 2 },
  subText: { color: '#6b7280', fontSize: 7, marginTop: 2 },
  scoreBadge: { backgroundColor: PDF_THEME.primary, borderRadius: 8, padding: '3 8' },
  scoreBadgeNum: { color: '#ffffff', fontSize: 14, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  scoreBadgeLabel: { color: '#fed7aa', fontSize: 7, textAlign: 'center' },
  scoreBarBg: { backgroundColor: PDF_THEME.scoreBar, height: 5, borderRadius: 3, marginTop: 10 },
  scoreBarFill: { height: 5, borderRadius: 3 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  metricCell: { width: '47%', border: '1 solid #fed7aa', borderRadius: 4, padding: 6 },
  metricLabel: { color: '#9ca3af', fontSize: 7, marginBottom: 2 },
  metricValue: { color: '#111827', fontSize: 13, fontFamily: 'Helvetica-Bold' },
  aiSection: { borderLeft: '3 solid #f97316', backgroundColor: PDF_THEME.aiSection, padding: '8 10', marginBottom: 12, borderRadius: '0 4 4 0' },
  aiLabel: { color: '#f97316', fontSize: 8, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  aiText: { color: '#374151', fontSize: 8, lineHeight: 1.5, marginBottom: 5 },
  aiBullet: { color: '#374151', fontSize: 7.5, lineHeight: 1.6, marginBottom: 1 },
  inputSection: { borderTop: '1 solid #e5e7eb', paddingTop: 8 },
  inputLabel: { color: '#9ca3af', fontSize: 7, marginBottom: 4, textTransform: 'uppercase' },
  inputPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  inputPill: { backgroundColor: PDF_THEME.inputPill, borderRadius: 3, padding: '2 6' },
  inputPillText: { color: '#374151', fontSize: 7 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 6, borderTop: '1 solid #e5e7eb' },
  footerBrand: { color: '#f97316', fontSize: 8, fontFamily: 'Helvetica-Bold' },
  footerMuted: { color: '#9ca3af', fontSize: 7 },
  sectionLabel: { color: '#6b7280', fontSize: 7, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
});

function scoreBarColor(score: number): string {
  if (score >= 70) return '#16a34a';
  if (score >= 40) return '#ca8a04';
  return '#dc2626';
}

export function CalculatorPDFDocument({
  calculatorType: _calculatorType, title, inputs, results, analysis, location, generatedAt,
}: PDFProps) {
  const dateStr = generatedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const locationStr = [location].filter(Boolean).join(' · ');
  const subline = [locationStr, dateStr].filter(Boolean).join(' · ');

  const resultEntries = Object.entries(results);
  const inputEntries = Object.entries(inputs);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.brandText}>ONDO</Text>
              <Text style={styles.titleText}>{title}</Text>
              {subline ? <Text style={styles.subText}>{subline}</Text> : null}
            </View>
            {analysis && (
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreBadgeNum}>{analysis.dealScore}</Text>
                <Text style={styles.scoreBadgeLabel}>{analysis.scoreLabel}</Text>
              </View>
            )}
          </View>
          {analysis && (
            <View style={styles.scoreBarBg}>
              <View style={[styles.scoreBarFill, {
                width: `${analysis.dealScore}%`,
                backgroundColor: scoreBarColor(analysis.dealScore),
              }]} />
            </View>
          )}
        </View>

        {/* Metrics grid — first 4 results */}
        {resultEntries.length > 0 && (
          <View>
            <Text style={styles.sectionLabel}>Results</Text>
            <View style={styles.metricsGrid}>
              {resultEntries.slice(0, 4).map(([label, value]) => (
                <View key={label} style={styles.metricCell}>
                  <Text style={styles.metricLabel}>{label.toUpperCase()}</Text>
                  <Text style={styles.metricValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* AI Analysis */}
        {analysis && (
          <View style={styles.aiSection}>
            <Text style={styles.aiLabel}>AI Analysis — Powered by Claude</Text>
            {analysis.marketContext ? <Text style={styles.aiText}>{analysis.marketContext}</Text> : null}
            {analysis.recommendations.map((rec, i) => (
              <Text key={i} style={styles.aiBullet}>· {rec}</Text>
            ))}
          </View>
        )}

        {/* Input summary */}
        {inputEntries.length > 0 && (
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Inputs</Text>
            <View style={styles.inputPills}>
              {inputEntries.map(([label, value]) => (
                <View key={label} style={styles.inputPill}>
                  <Text style={styles.inputPillText}>{label}: {value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>ondo.com</Text>
          <Text style={styles.footerMuted}>AI analysis by Claude Haiku</Text>
        </View>
      </Page>
    </Document>
  );
}
