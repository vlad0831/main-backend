export const USER_ASSET_CLASS_CHANGED = 'user_asset_class.changed';

export class UserAssetClassChangedEvent {
  constructor(public readonly userId: string) {}
}
