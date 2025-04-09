import { Divider } from "antd"

const Section = ({ title, children }: {
    title: string,
    children: JSX.Element
}) => {
    return (
        <section>
            <label htmlFor="" className="font-bold text-18">
                <Divider
                    style={{ margin: "0 0 5px" }}
                    orientation="left"
                    orientationMargin={0}
                >
                    <b style={{ fontSize: "20px" }}>{title}</b>
                </Divider>
            </label>

            <div className="modal__section__content">
                {children}
            </div>


        </section>
    )
}


export default Section