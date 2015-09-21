var applicationData = {
    goToPage: "home", // default page
    memberDetails: []
};


var TeamMember = React.createClass({
    handleOnClick: function(event) {
        event.preventDefault();
        this.props.setApplicationDetails("member", this.props.member);
    },

    render: function() {
        return (
            <tr>
                <td>{this.props.index}</td>
                <td>
                    <a href="#" onClick={this.handleOnClick}>
                        {this.props.member.nickname}
                    </a> <i className="fa fa-caret-right"></i>
                </td>
                <td>{this.props.member.name}</td>
            </tr>
        );
    }
});

var TeamMemberBox = React.createClass({
    loadTeamMembersFromServer: function() {
        var url="avengers.json";

        $.ajax({
            url: url,
            dataType: 'json',
            cache: true,
            success: function(data) {
                console.log(data)
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadTeamMembersFromServer();
    },
    render: function() {
        if (!this.state.data.members) {
            return <h4>Loading...</h4>;
        }

        var setApplicationDetails = this.props.setApplicationDetails;
        var teamMemberNodes = this.state.data.members.map(function(teamMember, index) {
            return (
                <TeamMember
                    member={teamMember}
                    index={++index}
                    setApplicationDetails={setApplicationDetails}
                    key={index} />
            );
        });
        return (
            <div className="teamMemberBox">
                <h2>Avengers</h2>
                <table className="table table-striped table-condensed table-hover table-narrow">
                    <thead>
                    <tr>
                        <td>#</td>
                        <td>Nickname</td>
                        <td>Name</td>
                    </tr>
                    </thead>
                    <tbody>
                    {teamMemberNodes}
                    </tbody>
                </table>
            </div>
        );
    }
});

/* ------------------------------- */
var MemberBox = React.createClass({
    executeBackToList: function(event) {
        event.preventDefault();
        this.props.setApplicationDetails("home", []);
    },

    executeRenderDetails: function(event) {
        event.preventDefault();
        this.setState({visibleDetails: true});
    },

    getInitialState: function() {
        return {visibleDetails: true};
    },

    render: function() {
        return (
            <div className="memberBox">
                <h3>{applicationData.memberDetails.name}</h3>

                <div className="btn-group">
                    <a className="btn btn-default btn-sm" href="#" onClick={this.executeBackToList}>
                        <i className="fa fa-caret-left"></i> Back to list
                    </a>
                </div>
                <MemberDetailsBox visible={this.state.visibleDetails} />
            </div>
        );
    }
});

var MemberDetailsBox = React.createClass({
    render: function() {
        if (this.props.visible) {
            return (
                <table id="memberDetailsTable" className="table table-striped table-condensed table-hover table-narrow">
                    <tr>
                        <th>Nickname</th>
                        <td>{applicationData.memberDetails.nickname}</td>
                    </tr>
                    <tr>
                        <th>Weapon</th>
                        <td>{applicationData.memberDetails.weapon}</td>
                    </tr>
                    <tr>
                        <th>Race</th>
                        <td>{applicationData.memberDetails.race}</td>
                    </tr>
                </table>
            )
        }

        return null;
    }
});

/* ------------------------------- */
var ContentBox = React.createClass({
    setApplicationDetails: function(pageData, memberData) {
        console.log(pageData);
        console.log(memberData);
        this.setState({page: pageData})

        return function() {
            applicationData.goToPage = Object.assign({}, applicationData.goToPage, pageData)
            applicationData.memberDetails = Object.assign({}, applicationData.memberDetails, memberData)
        }()
    },

    getInitialState: function() {
        return {page: "home"};
    },

    render: function() {
        switch (this.state.page) {
            case "home":
                return <TeamMemberBox setApplicationDetails={this.setApplicationDetails} />

            case "member":
                return <MemberBox setApplicationDetails={this.setApplicationDetails} />
        }
    }
})

React.render(
    <ContentBox page={"home"} />,
    document.getElementById('content')
);

