/* ============================================================
   Reports.jsx — Analytics & Reports Page with Full Interactivity
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import { useState, useEffect } from 'react';
import { monthlyStockData, categorySpendData, topMovingItems } from '../../services/mockData';
import { getInventory, getStockStatus } from '../../services/inventoryService';
import Modal from '../../components/modals/Modal';
import KpiCard from '../../components/common/KpiCard';
import './Reports.css';

const IconBarChart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);
const IconDownload = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IconTrendUp = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);

const maxStock = Math.max(...monthlyStockData.map(d => d.stockIn));
const totalCategorySpend = categorySpendData.reduce((s, c) => s + c.spend, 0);

const Reports = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('CSV');
  const [exportRange, setExportRange] = useState('Last 30 Days');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const inventory = await getInventory();
        const lowStock = inventory.filter(i => getStockStatus(i) === 'Low Stock').length;
        setLowStockCount(lowStock);
      } catch (e) {
        console.error('Failed to fetch stats', e);
      }
    };
    fetchStats();
  }, []);

  const stats = (() => {
    const totalMoves = monthlyStockData.reduce((s, d) => s + d.stockIn + d.stockOut, 0);
    const totalIn    = monthlyStockData.reduce((s, d) => s + d.stockIn, 0);
    const totalOut   = monthlyStockData.reduce((s, d) => s + d.stockOut, 0);
    return { totalMoves, totalIn, totalOut, lowStock: lowStockCount };
  })();

  const handleExportDownload = () => {
    // Generate simple simulated CSV content
    const csvContent = "data:text/csv;charset=utf-8,Month,Stock In,Stock Out,Transfers\n" +
      monthlyStockData.map(e => `${e.month},${e.stockIn},${e.stockOut},${e.transfers}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inventory_report_${exportRange.toLowerCase().replace(/\s+/g, '_')}.${exportFormat.toLowerCase()}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      setIsExportModalOpen(false);
    }, 1200);
  };

  return (
    <div className="rpt-page">

      {/* ── Header ── */}
      <div className="rpt-header">
        <div className="rpt-header-text">
          <div className="rpt-icon-wrap" aria-hidden="true"><IconBarChart /></div>
          <h1 className="rpt-page-title">Analytics & Reports</h1>
          <p className="rpt-page-subtitle">Inventory movement, spend analytics, and top-performing items</p>
        </div>
        <button
          type="button"
          className="rpt-btn-export"
          onClick={() => setIsExportModalOpen(true)}
          aria-label="Export reports"
        >
          <IconDownload /> Export Report
        </button>
      </div>

      {/* ── KPI Row ── */}
      <div className="rpt-kpi-row" role="list" aria-label="Key metrics">
        {[
          { label: 'Total Movements', value: stats.totalMoves,       trend: '+18% vs last month' },
          { label: 'Units Received',  value: stats.totalIn,          trend: '+12% vs last month' },
          { label: 'Units Dispatched',value: stats.totalOut,         trend: '+9% vs last month' },
          { label: 'Low Stock Items', value: stats.lowStock,         trend: 'Active monitoring' },
        ].map((k, i) => (
          <KpiCard key={i} label={k.label} value={k.value} trend={k.trend} />
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="rpt-grid-2">

        {/* Stock Movement Bar Chart */}
        <div className="rpt-card">
          <div className="rpt-card-header">
            <div>
              <div className="rpt-card-title">Stock Movements</div>
              <div className="rpt-card-sub">Apr – Sep 2026 · Monthly</div>
            </div>
          </div>
          <div className="rpt-bar-legend" aria-hidden="true">
            <div className="rpt-legend-item"><span className="rpt-legend-dot rpt-legend-dot--in" /> Stock In</div>
            <div className="rpt-legend-item"><span className="rpt-legend-dot rpt-legend-dot--out" /> Stock Out</div>
            <div className="rpt-legend-item"><span className="rpt-legend-dot rpt-legend-dot--tr" /> Transfers</div>
          </div>
          <div className="rpt-bar-chart" role="img" aria-label="Monthly stock movement chart">
            {monthlyStockData.map(d => (
              <div key={d.month} className="rpt-bar-row">
                <div className="rpt-bar-meta">
                  <span className="rpt-bar-month">{d.month}</span>
                  <span className="rpt-bar-vals">In: {d.stockIn} · Out: {d.stockOut} · Tr: {d.transfers}</span>
                </div>
                <div className="rpt-bar-group">
                  <div className="rpt-bar-track"><div className="rpt-bar-fill rpt-bar-fill--in" style={{ width: `${(d.stockIn/maxStock)*100}%` }} /></div>
                  <div className="rpt-bar-track"><div className="rpt-bar-fill rpt-bar-fill--out" style={{ width: `${(d.stockOut/maxStock)*100}%` }} /></div>
                  <div className="rpt-bar-track"><div className="rpt-bar-fill rpt-bar-fill--tr" style={{ width: `${(d.transfers/maxStock)*100}%` }} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Spend */}
        <div className="rpt-card">
          <div className="rpt-card-header">
            <div>
              <div className="rpt-card-title">Spend by Category</div>
              <div className="rpt-card-sub">Total: ₹{(totalCategorySpend/100000).toFixed(1)}L</div>
            </div>
          </div>
          <div className="rpt-category-list" role="img" aria-label="Category spend breakdown">
            {categorySpendData.map(c => {
              const pct = Math.round((c.spend / totalCategorySpend) * 100);
              return (
                <div key={c.category} className="rpt-cat-row">
                  <div className="rpt-cat-meta">
                    <div>
                      <div className="rpt-cat-name">{c.category}</div>
                      <div className="rpt-cat-pct">{pct}% of total</div>
                    </div>
                    <div className="rpt-cat-val">₹{(c.spend/100000).toFixed(1)}L</div>
                  </div>
                  <div className="rpt-cat-track">
                    <div className="rpt-cat-fill" style={{ width: `${pct}%`, background: c.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Moving Items */}
        <div className="rpt-card rpt-card-full">
          <div className="rpt-card-header">
            <div>
              <div className="rpt-card-title">Top Moving Items</div>
              <div className="rpt-card-sub">Ranked by total movements this period</div>
            </div>
          </div>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table className="rpt-movers-table" aria-label="Top moving items">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Product</th>
                  <th scope="col">SKU</th>
                  <th scope="col">Movements</th>
                  <th scope="col">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topMovingItems.map((item, i) => (
                  <tr key={item.sku}>
                    <td><span className={`rpt-rank rpt-rank--${i+1}`}>#{i+1}</span></td>
                    <td style={{ fontWeight: 600, color: '#1e293b' }}>{item.name}</td>
                    <td><span className="rpt-sku">{item.sku}</span></td>
                    <td style={{ fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>{item.movements}</td>
                    <td>
                      <span className={item.trend.startsWith('+') ? 'rpt-trend-up' : 'rpt-trend-down'}>
                        {item.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── MODAL: Export Report ── */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Analytics & Reports"
        subtitle="Select format and date range to download"
        icon={<IconDownload />}
        iconClass="modal-header-icon--blue"
        size="md"
        footer={
          <div className="modal-actions-right">
            <button type="button" className="btn-modal btn-modal-secondary" onClick={() => setIsExportModalOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn-modal btn-modal-primary"
              style={{ background: '#2563eb' }}
              onClick={handleExportDownload}
            >
              {downloadSuccess ? 'Downloaded! ✓' : 'Download Report'}
            </button>
          </div>
        }
      >
        <div className="modal-form-grid">
          <div className="modal-form-group modal-col-12">
            <label className="modal-label" htmlFor="export-range">Date Range</label>
            <select
              id="export-range"
              className="modal-select"
              value={exportRange}
              onChange={e => setExportRange(e.target.value)}
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Q3 2026</option>
              <option>Year to Date (2026)</option>
            </select>
          </div>

          <div className="modal-form-group modal-col-12">
            <label className="modal-label" htmlFor="export-format">Export Format</label>
            <select
              id="export-format"
              className="modal-select"
              value={exportFormat}
              onChange={e => setExportFormat(e.target.value)}
            >
              <option>CSV (Comma Separated Values)</option>
              <option>Excel Worksheet (.xlsx)</option>
              <option>PDF Summary Document</option>
            </select>
          </div>

          {downloadSuccess && (
            <div className="modal-col-12" style={{ padding: '12px', background: '#dcfce7', color: '#15803d', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, textAlign: 'center' }}>
              ✓ Report downloaded successfully!
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
};

export default Reports;
