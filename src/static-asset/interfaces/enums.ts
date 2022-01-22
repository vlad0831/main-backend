import { registerEnumType } from '@nestjs/graphql';

export enum TypeStaticAsset {
  Text = 'Text',
  Image = 'Image',
  Animation = 'Animation',
}

registerEnumType(TypeStaticAsset, {
  name: 'TypeStaticAsset',
  description: 'possible type of static asset',
});
