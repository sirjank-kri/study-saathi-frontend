import './SkeletonCard.css';

export const SkeletonStatCard = () => (
  <div className="skeleton-card stat-card">
    <div className="skeleton skeleton-text skeleton-label"></div>
    <div className="skeleton skeleton-text skeleton-value"></div>
  </div>
);

export const SkeletonSubjectCard = () => (
  <div className="skeleton-card subject-card">
    <div className="skeleton skeleton-text skeleton-title"></div>
    <div className="skeleton skeleton-text skeleton-meta"></div>
    <div className="skeleton skeleton-text skeleton-meta"></div>
    <div className="skeleton skeleton-button"></div>
  </div>
);

export const SkeletonTableRow = () => (
  <tr className="skeleton-row">
    <td><div className="skeleton skeleton-text"></div></td>
    <td><div className="skeleton skeleton-text"></div></td>
    <td><div className="skeleton skeleton-text"></div></td>
    <td><div className="skeleton skeleton-text"></div></td>
    <td><div className="skeleton skeleton-text"></div></td>
  </tr>
);