import { counterMachine } from "./counterMachine";
import { useMachine } from "@xstate/react";
import "./App.css";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import {  AiOutlinePlus, AiOutlineMinus, AiOutlineClose } from "react-icons/ai";


function App() {
  const [state, send] = useMachine(counterMachine);

  const [{ x, y }, api] = useSpring(() => ({
  x : 0 , y : 0
  }));

  const [{ xx }, container] = useSpring(() => ({x:0,y:0, config: {
    mass: 1.6,
    friction: 10,
    tension: 160,
  }}))

  const bindhandlecount = useDrag(
    (props) => {
      console.log(props)
      const { down, offset: [mx, my] } = props
      console.log(mx, my);
      if (down & (mx > 100)) {
        console.log("SEND EVENT");
        send("INCREMENT");
        send("DEACTIVE");
      } else if (down && mx < -88) {
        send("DECREMENT");
        send("DEACTIVE");
      } else if (!down && (mx > -10 || mx < 10)) {
        send("ACTIVE");
      } else if (down && my > 28) {
        console.log("reset")
        send("RESET");
        send("DEACTIVE");
      }
      console.log((mx < 10 || mx > -10))
      api.start({ x: down ? mx : 0, y: down && mx < 10  && mx > -10 ? my : 0 });
      container.start({ xx: down && (mx < 0.64 || mx > -0.64) ? (mx / 5) : 0 })

      // api.update({
      //   x: x > -100 || x < 100 ? x + mx : x,
      //   y: y + my
      // })
    },
    {
      bounds: { top: 0, bottom: 32, left: -115, right: 125 },
      filterTaps: true,
      from: () => [x.get(), y.get()]
    },
    //     {

    
  );


  return (
    <div style={{ width: "100%" }}>
      <animated.div style={{touchAction: "none", x: xx }} className="container">
        
            <AiOutlineMinus className="btn-1" onClick={() => send("DECREMENT")}/>
        
             <AiOutlinePlus className="btn-2" onClick={() => send("INCREMENT")}/>
     
     
      </animated.div>
      <div style={{ width: "100%", position: "relative" }}>
        <animated.div
            {...bindhandlecount()}
            style={{ touchAction: "none", x, y }}
            className="count"
            
          >
            
            <h2 className="count-0">
              {state.context.count}
            </h2>
            
            
          </animated.div>
          {/* <AiOutlineClose onClick={() => send("RESET")} /> */}
      </div>
      
    </div>
  );
}

export default App;
