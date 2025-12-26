import { useState } from 'react';
import { useMarket } from '@/context/MarketContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MessageSquare, Key, Link, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export const WhatsAppSettings = () => {
  const { whatsAppConfig, updateWhatsAppConfig } = useMarket();
  const { toast } = useToast();
  const [localApiKey, setLocalApiKey] = useState(whatsAppConfig.apiKey);
  const [localWebhook, setLocalWebhook] = useState(whatsAppConfig.webhookUrl);
  const [errors, setErrors] = useState<{ apiKey?: string; webhook?: string }>({});

  const validateApiKey = (key: string): boolean => {
    if (!key.trim()) {
      setErrors((prev) => ({ ...prev, apiKey: 'API Key is required' }));
      return false;
    }
    if (key.length < 20) {
      setErrors((prev) => ({ ...prev, apiKey: 'API Key must be at least 20 characters' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, apiKey: undefined }));
    return true;
  };

  const validateWebhook = (url: string): boolean => {
    if (!url.trim()) {
      setErrors((prev) => ({ ...prev, webhook: 'Webhook URL is required' }));
      return false;
    }
    try {
      new URL(url);
      if (!url.startsWith('https://')) {
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

  const handleSave = () => {
    const isApiKeyValid = validateApiKey(localApiKey);
    const isWebhookValid = validateWebhook(localWebhook);

    if (isApiKeyValid && isWebhookValid) {
      updateWhatsAppConfig({
        apiKey: localApiKey,
        webhookUrl: localWebhook,
      });
      toast({
        title: 'Configuration Saved',
        description: 'WhatsApp integration settings have been updated.',
      });
    }
  };

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
      title: enabled ? 'Integration Enabled' : 'Integration Disabled',
      description: enabled
        ? 'WhatsApp alerts are now active.'
        : 'WhatsApp alerts have been disabled.',
    });
  };

  return (
    <div className="flex flex-col h-full">
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

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* API Key */}
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

        {/* Webhook URL */}
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
        <Button onClick={handleSave} className="w-full" variant="default">
          Save Configuration
        </Button>

        {/* Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
          <div>
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

        {/* Info */}
        <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
          <p className="text-xs text-accent font-medium mb-2">Integration Info</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Alerts sent for high-reliability events only</li>
            <li>• Maximum 10 alerts per hour to prevent spam</li>
            <li>• Webhook must respond within 5 seconds</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
