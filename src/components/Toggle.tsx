import React from 'react';

interface ToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label: string;
    description?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ enabled, onChange, label, description }) => {
    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex flex-col mr-4">
                <span className="text-[15px] font-medium text-label-primary">{label}</span>
                {description && (
                    <span className="text-[13px] text-label-tertiary mt-0.5">{description}</span>
                )}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={enabled}
                className={`toggle-switch ${enabled ? 'active' : ''}`}
                onClick={() => onChange(!enabled)}
            />
        </div>
    );
};
