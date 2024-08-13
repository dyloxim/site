import { I_affine, I_linear, I_transform } from "@IFS/types/mathematical"


const Function = ({f, key}: {f: I_transform, key: number}) => {

  let linear = (f as I_linear).linear;
  let translation = (f as I_affine).translation ?
    (f as I_affine).translation : [0,0]

  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: ".5em"
      }}>
        <pre>f_{key} = </pre>

        <div style={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          gap: ".5em"
        }}>
          {linear.map(row => {
            return (
              <div style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: ".5em"
              }}>
                {row.map(coeff => {
                  return (
                    <pre>{coeff}</pre>
                  );
                })}
              </div>);
          })}
        </div>

        <pre> + </pre>


        <div style={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          gap: ".5em"
        }}>
          {translation.map(coeff => {
            return (
              <pre>{coeff}</pre>
            )})}
        </div>
      </div>
    </>
  )
}

export default Function;
