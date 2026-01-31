interface StatusBadgeProps {
    status: 'active' | 'iterating' | 'paused';
}

const statusLabels = {
    active: 'Active',
    iterating: 'Iterating',
    paused: 'Paused',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span className={`status-badge status-${status}`}>
            {statusLabels[status]}
        </span>
    );
}
