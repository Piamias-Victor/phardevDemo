```typescript
import { Object3DNode, MaterialNode } from "@react-three/fiber";
import { ShaderMaterial } from "three";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      paperBurnMaterial: any;
      featheredImageMaterial: any;
    }
  }
}
