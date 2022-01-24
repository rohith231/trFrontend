import React, { useEffect, useState, useContext } from "react";
import { useQuery } from "react-query";
import ListGroup from "reactstrap/lib/ListGroup";
import ListGroupItem from "reactstrap/lib/ListGroupItem";
import { getFuncsFuncgroupsByRoleId } from "network/ApiAxios";
import MyAccordian from "components/commonComps/MyAccordian";
import { funcContext } from "GlobalState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faPuzzlePiece,
} from "@fortawesome/free-solid-svg-icons";
import Card from "reactstrap/lib/Card";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import AlertModal from "./AlertModal";

const FunctionalityBar = () => {
  const [groups, setGroups] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const roleId = localStorage.getItem("role_id");
  const [state, dispatch] = useContext(funcContext);
  const { data, isSuccess } = useQuery(
    ["funcsfuncgroupsByRole", roleId],
    () => getFuncsFuncgroupsByRoleId(roleId),
    {
      select: (funcsfuncgroupsByRole) => funcsfuncgroupsByRole.data,
    }
  );
  useEffect(() => {
    if (data) {
      let newGroup = {};
      data.funcsFuncgroups?.forEach((item) => {
        if (newGroup[item.group_name]) {
          newGroup[item.group_name] = [
            ...newGroup[item.group_name],
            {
              funcName: item.functionality_name,
              funcLabel: item.functionality_label,
              funcId: item.id,
            },
          ];
        } else {
          newGroup[item.group_name] = [
            {
              funcName: item.functionality_name,
              funcLabel: item.functionality_label,
              funcId: item.id,
            },
          ];
        }
      });
      setGroups(newGroup);
    }
  }, [data]);
  const renderList = () => {
    let listItems = [];
    for (const key in groups) {
      if (key === "ungrouped") {
        listItems.push(
          ...groups[key].map((func) => {
            return (
              <ListGroupItem
                key={func.funcId}
                onClick={() => {
                  setTitle(func.funcName);
                  setShowModal(true);
                }}
                style={
                  state[func.funcName]
                    ? {
                        backgroundColor: "#b2dfdb",
                        border: "solid 1px #80cbc4",
                      }
                    : {}
                }
              >
                <Row>
                  <Col sm="3" xs="2">
                    <FontAwesomeIcon icon={faChevronRight} className="mr-5" />
                  </Col>
                  <Col sm="9" xs="10" style={{ textAlign: "start" }}>
                    {" "}
                    {func.funcLabel}
                  </Col>
                </Row>
              </ListGroupItem>
            );
          })
        );
      } else {
        const accBody = () => {
          return groups[key].map((func) => {
            return (
              <ListGroupItem
                key={func.funcId}
                onClick={() => {
                  setTitle(func.funcName);
                  if (func.funcName === "layerList") {
                    dispatch({ type: "toggleFuncs", payload: func.funcName });
                  } else {
                    setShowModal(true);
                  }
                }}
                style={
                  state[func.funcName]
                    ? {
                        backgroundColor: "#b2dfdb",
                        border: "solid 1px #80cbc4",
                      }
                    : {}
                }
              >
                <Row>
                  <Col sm="3" xs="2">
                    <FontAwesomeIcon icon={faChevronRight} className="mr-5" />
                  </Col>
                  <Col sm="9" xs="10" style={{ textAlign: "start" }}>
                    {" "}
                    {func.funcLabel}
                  </Col>
                </Row>
              </ListGroupItem>
            );
          });
        };
        listItems.push(
          <MyAccordian accHeader={key} accBody={accBody} key={key} />
        );
      }
    }
    return listItems;
  };
  return (
    <Card className="mt--2 pt-3">
      <Row className="text-center">
        <Col
          sm="3"
          xs="2"
          style={{ fontSize: "28px", paddingLeft: "30px" }}
          className="text-muted"
        >
          <FontAwesomeIcon icon={faPuzzlePiece} />
        </Col>
        <Col
          sm="9"
          xs="10"
          className="h3 text-muted pl-4"
          style={{ textAlign: "start" }}
        >
          Widgets
        </Col>
      </Row>
      <ListGroup className="mt-3">
        {isSuccess && data.success && renderList()}
      </ListGroup>
      <AlertModal setTitle={title} show={showModal} setShow={setShowModal} />
    </Card>
  );
};

export default FunctionalityBar;
