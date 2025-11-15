import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { usePwaInstallPrompt } from '@/hooks/usePwaInstallPrompt'

export function InstallPwaDialog() {
  const { showPrompt, promptInstall, cancelPrompt } = usePwaInstallPrompt()

  return (
    <Dialog open={showPrompt} onOpenChange={cancelPrompt}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Install Base QR Tool</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          Install this app on your device for a better experience.
        </div>
        <DialogFooter className="pt-4">
          <Button variant="secondary" onClick={cancelPrompt}>
            Maybe later
          </Button>
          <Button onClick={promptInstall}>Install</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
