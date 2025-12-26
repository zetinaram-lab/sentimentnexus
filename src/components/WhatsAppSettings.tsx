/**
 * WhatsApp Settings Component
 * Configuration panel for WhatsApp API integration with validation and persistence
 */

import { useState, useEffect } from 'react';
import { useMarket } from '@/context/MarketContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  MessageSquare,
  Key,
  Link,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Validation rules
const VALIDATION = {
  API_KEY_MIN_LENGTH: 20,
  WEBHOOK_PROTOCOL: 'https://',
} as const;

interface ValidationErrors {
  apiKey?: string;
  webhook?: string;
}

export const WhatsAppSettings = () => {
  const {
    whatsAppConfig,
    updateWhatsAppConfig,
    saveWhatsAppConfig,
    resetTerminal,
  } = useMarket();
  const { toast } = useToast();

  // Local form state
  const [localApiKey, setLocalApiKey] = useState(whatsAppConfig.apiKey);
  const [localWebhook, setLocalWebhook] = useState(whatsAppConfig.webhookUrl);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Sync local state with context when it changes externally (e.g., reset)
  useEffect(() => {
    setLocalApiKey(whatsAppConfig.apiKey);
    setLocalWebhook(whatsAppConfig.webhookUrl);
    setHasChanges(false);
  }, [whatsAppConfig.apiKey, whatsAppConfig.webhookUrl]);

  // Track changes
  useEffect(() => {
    const changed =
      localApiKey !== whatsAppConfig.apiKey ||
      localWebhook !== whatsAppConfig.webhookUrl;
    setHasChanges(changed);
  }, [localApiKey, localWebhook, whatsAppConfig]);

  /**
   * Validate API Key
   */
  const validateApiKey = (key: string): boolean => {
    if (!key.trim()) {
      setErrors((prev) => ({ ...prev, apiKey: 'API Key is required' }));
      return false;
    }
    if (key.length < VALIDATION.API_KEY_MIN_LENGTH) {
      setErrors((prev) => ({
        ...prev,
        apiKey: `API Key must be at least ${VALIDATION.API_KEY_MIN_LENGTH} characters`,
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, apiKey: undefined }));
    return true;
  };

  /**
   * Validate Webhook URL
   */
  const validateWebhook = (url: string): boolean => {
    if (!url.trim()) {
      setErrors((prev) => ({ ...prev, webhook: 'Webhook URL is required' }));
      return false;
    }
    try {
      new URL(url);
      if (!url.startsWith(VALIDATION.WEBHOOK_PROTOCOL)) {
        setErrors((prev) => ({ ...prev, webhook: 'Webhook must use HTTPS' }));
        return false;
      }
      setErrors((prev) => ({ ...prev, webhook: undefined }));
      return true;
    } catch {
      setErrors((prev) => ({ ...prev, webhook: 'Invalid URL format' }));
      return false;
    }
  };

  /**
   * Handle save configuration
   */
  const handleSave = () => {
    const isApiKeyValid = validateApiKey(localApiKey);
    const isWebhookValid = validateWebhook(localWebhook);

    if (isApiKeyValid && isWebhookValid) {
      updateWhatsAppConfig({
        apiKey: localApiKey,
        webhookUrl: localWebhook,
      });
      // Defer save to ensure state is updated
      setTimeout(() => {
        saveWhatsAppConfig();
      }, 0);
    }
  };

  /**
   * Handle toggle alerts
   */
  const handleToggle = (enabled: boolean) => {
    if (enabled && (!whatsAppConfig.apiKey || !whatsAppConfig.webhookUrl)) {
      toast({
        title: 'Configuration Required',
        description: 'Please save your API Key and Webhook URL first.',
        variant: 'destructive',
      });
      return;
    }
    updateWhatsAppConfig({ isEnabled: enabled });
    toast({
      title: enabled ? 'Alerts Enabled' : 'Alerts Disabled',
      description: enabled
        ? 'You will receive WhatsApp alerts for high-reliability signals.'
        : 'WhatsApp alerts have been disabled.',
    });
  };

  /**
   * Handle terminal reset
   */
  const handleReset = () => {
    if (window.confirm('This will clear all saved data and configurations. Continue?')) {
      resetTerminal();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-foreground">
            WhatsApp Alerts
          </h2>
        </div>
        <div
          className={cn(
            'flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium',
            whatsAppConfig.isEnabled
              ? 'bg-success/20 text-success'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {whatsAppConfig.isEnabled ? (
            <>
              <CheckCircle className="w-3 h-3" />
              ACTIVE
            </>
          ) : (
            <>
              <AlertCircle className="w-3 h-3" />
              INACTIVE
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* API Key Input */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <Key className="w-3.5 h-3.5" />
            API Key
          </Label>
          <Input
            type="password"
            placeholder="Enter your WhatsApp API Key"
            value={localApiKey}
            onChange={(e) => {
              setLocalApiKey(e.target.value);
              if (errors.apiKey) validateApiKey(e.target.value);
            }}
            className={cn(
              'bg-background border-border font-mono text-sm',
              errors.apiKey && 'border-destructive focus-visible:ring-destructive'
            )}
          />
          {errors.apiKey && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.apiKey}
            </p>
          )}
        </div>

        {/* Webhook URL Input */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <Link className="w-3.5 h-3.5" />
            Webhook URL
          </Label>
          <Input
            type="url"
            placeholder="https://your-webhook-endpoint.com"
            value={localWebhook}
            onChange={(e) => {
              setLocalWebhook(e.target.value);
              if (errors.webhook) validateWebhook(e.target.value);
            }}
            className={cn(
              'bg-background border-border font-mono text-sm',
              errors.webhook && 'border-destructive focus-visible:ring-destructive'
            )}
          />
          {errors.webhook && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.webhook}
            </p>
          )}
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full gap-2"
          variant="default"
          disabled={!hasChanges}
        >
          <Save className="w-4 h-4" />
          Save Configuration
        </Button>

        {/* Alert Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
          <div className="flex-1 min-w-0 pr-3">
            <p className="text-sm font-medium text-foreground">Enable Alerts</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Receive real-time signals via WhatsApp
            </p>
          </div>
          <Switch
            checked={whatsAppConfig.isEnabled}
            onCheckedChange={handleToggle}
          />
        </div>

        {/* Info Box */}
        <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
          <p className="text-xs text-accent font-medium mb-2">Integration Info</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Alerts sent for high-reliability events only</li>
            <li>• Maximum 10 alerts per hour to prevent spam</li>
            <li>• Settings persist across browser sessions</li>
          </ul>
        </div>

        {/* Reset Terminal */}
        <Button
          onClick={handleReset}
          variant="outline"
          className="w-full gap-2 text-muted-foreground hover:text-destructive hover:border-destructive"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Terminal
        </Button>
      </div>
    </div>
  );
};
