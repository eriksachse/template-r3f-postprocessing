import { Canvas } from "@react-three/fiber";
import Effects from "./components/postprocessing/Effects";
import Scene from "./Scene";

function App() {
  return (
    <Canvas>
      <Effects>
        <Scene />
      </Effects>
    </Canvas>
  );
}

export default App;
