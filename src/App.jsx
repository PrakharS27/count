import { counterMachine } from "./counterMachine";
import { useMachine } from "@xstate/react";
import "./App.css";
import { useSpring, animated, useTransition, useScroll } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineClose } from "react-icons/ai";
import { useState } from "react";


function App() {
  const [state, send] = useMachine(counterMachine);


  const [{ x, y, opacity }, api] = useSpring(() => ({
  x : 0 , y : 0
  }, {
    from: {
      opacity: 0
    },
    to: {
      opacity: 1
    }
  }));

  const props1 = useSpring({
    from: { x: 0, y: 0 },
    to: { x: 100, y: 100 },
  })

  const [show, setShow] = useState(false);
  
  const transitions = useTransition(show, {
    from: { x: 0, y: 0, opacity: 1 },
    enter: item => async (next) => {
      await next({ opacity: 1 });
      await next({ x: item.direction === 'x' ? 100 : 0, y: item.direction === 'y' ? 100 : 0 });
    },
    leave: item => async (next) => {
      await next({ x: item.direction === 'x' ? 100 : 0, y: item.direction === 'y' ? 100 : 0 });
      await next({ opacity: 0 });
    },
  });

  
  const [{ xx }, container] = useSpring(() => ({x:0,y:0, config: {
    mass: 1.6,
    friction: 10,
    tension: 160,
  }}))

  const bindhandlecount = useDrag(
    (props) => {
      console.log(props)
      const { down, offset: [mx, my] } = props;
      console.log(mx, my);
      console.log(down);
      if (down & (mx > 100)) {

        console.log("SEND EVENT");
        send("INCREMENT");
        send("DEACTIVE");
      } else if (down && mx < -88) {
        send("DECREMENT");
        send("DEACTIVE");
      } else if (!down && (mx > -10 || mx < 10)) { 
        send("ACTIVE");
      } else if (down && my > 49) {
        console.log("reset");
        send("RESET");
        send("DEACTIVE");
      }
      console.log((mx < 10 || mx > -10))
      api.start({ x: down ? mx : 0, y: down && mx < 2  && mx > -2 ? my : 0, opacity: (down && mx < 10  && mx > -10 && (my > 5)) ? 1 : 0  });
      
      container.start({ xx: down && (mx < 0.64 || mx > -0.64) ? (mx / 5) : 0 });

    
    },
    {
      bounds: { top: 0, bottom: 50, left: -115, right: 125 },
      filterTaps: true,
      from: () => [x.get(), y.get()]
      
    },
    //     {

    
  );

  console.log("opacity.get()" ,opacity)

  return (
    <div style={{ width: "100%" }}>
      <animated.div style={{touchAction: "none", x: xx }} className="container">
        
            <AiOutlineMinus className="btn-1"  onClick={() => send("DECREMENT")} />

            <animated.div style={{opacity:opacity,}}><AiOutlineClose className="cross" value={{color:'white', size:'2rem'}}/>
        </animated.div>
             <AiOutlinePlus className="btn-2" onClick={() => send("INCREMENT")}/>
     
            
      </animated.div>
      
      <div style={{ width: "100%", position: "relative" }}>
     
        <animated.div
            {...bindhandlecount()}
            style={{ touchAction: "none", x, y }}
            className="count"
            
          >
            
            <h2  className="count-0" onClick={() => send("INCREMENT")}>
              {state.context.count}
            </h2>
            
            
          </animated.div>
          
      </div>
     
       
    </div>
  );
}

export default App;
